"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, ListOrdered } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';

export default function ListGeneratorPage() {
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(10);
    const [step, setStep] = useState(1);
    const [prefix, setPrefix] = useState('');
    const [suffix, setSuffix] = useState('');
    const [generatedList, setGeneratedList] = useState('');
    const { toast } = useToast();

    const handleGenerate = () => {
        if (step === 0) {
             toast({
                title: "Invalid Step",
                description: "Step cannot be zero.",
                variant: "destructive"
            });
            return;
        }

        const list = [];
        if (start <= end && step > 0) {
            for (let i = start; i <= end; i += step) {
                list.push(`${prefix}${i}${suffix}`);
            }
        } else if (start >= end && step < 0) {
             for (let i = start; i >= end; i += step) {
                list.push(`${prefix}${i}${suffix}`);
            }
        } else {
             // Try to handle implicit direction or show error
             // If start < end but step is negative -> infinite or wrong
             // If start > end but step is positive -> wrong
             
             // Auto-correct step sign if user didn't specify
             let effectiveStep = step;
             if (start < end && step < 0) effectiveStep = -step;
             if (start > end && step > 0) effectiveStep = -step;
             
             for (let i = start; (effectiveStep > 0 ? i <= end : i >= end); i += effectiveStep) {
                list.push(`${prefix}${i}${suffix}`);
                 if (list.length > 10000) break; // Safety break
             }
        }
        
        if (list.length > 10000) {
             toast({
                title: "List Truncated",
                description: "Generated list truncated to 10,000 items for performance.",
                variant: "warning"
            });
        }

        setGeneratedList(list.join('\n'));
    };

    const copyToClipboard = () => {
        if (!generatedList) return;
        navigator.clipboard.writeText(generatedList);
        toast({
            title: "Copied!",
            description: "List copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <ListOrdered className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">List Generator</h1>
                    <p className="text-muted-foreground mt-2">
                        Create custom number lists by specifying start, end, and step.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="start">Start Number</Label>
                                <Input 
                                    id="start" 
                                    type="number" 
                                    value={start} 
                                    onChange={(e) => setStart(Number(e.target.value))} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end">End Number</Label>
                                <Input 
                                    id="end" 
                                    type="number" 
                                    value={end} 
                                    onChange={(e) => setEnd(Number(e.target.value))} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="step">Step</Label>
                                <Input 
                                    id="step" 
                                    type="number" 
                                    value={step} 
                                    onChange={(e) => setStep(Number(e.target.value))} 
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="prefix">Prefix (Optional)</Label>
                                <Input 
                                    id="prefix" 
                                    value={prefix} 
                                    onChange={(e) => setPrefix(e.target.value)} 
                                    placeholder="e.g. Item "
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="suffix">Suffix (Optional)</Label>
                                <Input 
                                    id="suffix" 
                                    value={suffix} 
                                    onChange={(e) => setSuffix(e.target.value)} 
                                    placeholder="e.g. ."
                                />
                            </div>
                            <Button className="w-full" onClick={handleGenerate}>
                                Generate List
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Generated List</CardTitle>
                             <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!generatedList}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Textarea
                                readOnly
                                value={generatedList}
                                className="h-[400px] font-mono"
                                placeholder="Your list will appear here..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
