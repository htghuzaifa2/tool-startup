
"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from "@/hooks/use-toast";
import { Database, Save, Trash2, PlusCircle, RefreshCw } from 'lucide-react';
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


type StorageEntry = {
    key: string;
    value: string;
};

export default function LocalStorageEditorPage() {
    const [entries, setEntries] = useState<StorageEntry[]>([]);
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const { toast } = useToast();
    const localStorageGuide = guides.find(g => g.href.includes('local-storage-editor'));

    const handleGuideClick = () => {
        // The content is not immediately available, so we wait for the next render tick.
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80; // a little space from the top
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    };

    const loadFromStorage = useCallback(() => {
        if (typeof window === 'undefined') return;
        try {
            const keys = Object.keys(localStorage);
            const allEntries = keys.map(key => ({
                key,
                value: localStorage.getItem(key) || '',
            }));
            setEntries(allEntries);
        } catch (error) {
            console.error("Could not access local storage:", error);
            toast({
                title: "Access Error",
                description: "Could not read from local storage. Your browser may have it disabled or be in private mode.",
                variant: "destructive"
            });
        }
    }, [toast]);

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    const handleValueChange = (key: string, value: string) => {
        setEntries(entries.map(entry => entry.key === key ? { ...entry, value } : entry));
    };
    
    const formatJson = (value: string) => {
        try {
            const parsed = JSON.parse(value);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return value; // Not a valid JSON, return as is
        }
    };

    const handleSave = (key: string) => {
        const entry = entries.find(e => e.key === key);
        if (entry) {
            try {
                localStorage.setItem(key, entry.value);
                // Prettify the JSON in the textarea after saving
                handleValueChange(key, formatJson(entry.value));
                toast({
                    title: "Success",
                    description: `Entry "${key}" has been saved.`,
                });
            } catch (error) {
                console.error("Error saving to local storage:", error);
                toast({
                    title: "Save Error",
                    description: "Could not save the entry. Storage may be full.",
                    variant: "destructive"
                });
            }
        }
    };

    const handleDelete = (key: string) => {
        try {
            localStorage.removeItem(key);
            loadFromStorage();
            toast({
                title: "Deleted",
                description: `Entry "${key}" has been deleted.`,
            });
        } catch (error) {
            console.error("Error deleting from local storage:", error);
            toast({ title: "Delete Error", variant: "destructive" });
        }
    };

    const handleAddNew = () => {
        if (!newKey.trim()) {
            toast({ title: "Error", description: "Key cannot be empty.", variant: "destructive" });
            return;
        }
        if (localStorage.getItem(newKey.trim()) !== null) {
            toast({ title: "Error", description: `Key "${newKey.trim()}" already exists.`, variant: "destructive" });
            return;
        }
        try {
            localStorage.setItem(newKey.trim(), newValue);
            loadFromStorage();
            toast({ title: "Success", description: `New entry "${newKey.trim()}" added.` });
            setNewKey('');
            setNewValue('');
        } catch (error) {
            console.error("Error adding to local storage:", error);
            toast({ title: "Add Error", description: "Could not add the entry. Storage may be full.", variant: "destructive" });
        }
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Database className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Local Storage Editor</CardTitle>
                        <CardDescription>View, edit, and manage your browser's local storage data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-end">
                            <Button onClick={loadFromStorage} variant="outline">
                                <RefreshCw className="mr-2 h-4 w-4" /> Reload Data
                            </Button>
                        </div>
                        {entries.length > 0 ? (
                             <Accordion type="single" collapsible className="w-full">
                                {entries.map(({ key, value }) => (
                                    <AccordionItem value={key} key={key}>
                                        <AccordionTrigger className="font-mono text-sm hover:no-underline">
                                            <span className="truncate">{key}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-2">
                                            <Textarea
                                                value={value}
                                                onChange={(e) => handleValueChange(key, e.target.value)}
                                                className="min-h-[150px] font-mono text-xs"
                                                placeholder="Enter value (JSON will be auto-formatted on save)"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" onClick={() => handleSave(key)}><Save className="mr-2 h-4 w-4"/>Save</Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(key)}><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="text-center text-muted-foreground py-10">
                                <p>No local storage entries found.</p>
                            </div>
                        )}
                        
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-xl font-headline">Add New Entry</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input 
                                    placeholder="Enter new key"
                                    value={newKey}
                                    onChange={(e) => setNewKey(e.target.value)}
                                    className="font-mono"
                                />
                                <Textarea
                                    placeholder="Enter value (can be string or JSON)"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    className="min-h-[100px] font-mono"
                                />
                            </CardContent>
                            <CardFooter>
                                 <Button onClick={handleAddNew}>
                                    <PlusCircle className="mr-2 h-4 w-4"/> Add Entry
                                </Button>
                            </CardFooter>
                        </Card>

                    </CardContent>
                </Card>

                {localStorageGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                             <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{localStorageGuide.title}</CardTitle>
                                        <CardDescription>{localStorageGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {localStorageGuide.steps.map((step, stepIndex) => (
                                                <li key={stepIndex}>{step}</li>
                                            ))}
                                        </ol>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )}
            </div>
        </div>
    );
}
