
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from "@/hooks/use-toast";
import { ArrowDown, Copy, SortAsc, SortDesc, ArrowDownUp } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function NumberSorterPage() {
    const [inputText, setInputText] = useState('10, 5, 8, 2, 100, 1');
    const [outputText, setOutputText] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const { toast } = useToast();
    const numberSorterGuide = guides.find(g => g.href.includes('number-sorter'));

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

    const handleSort = () => {
        if (!inputText.trim()) {
            toast({
                title: 'No Input',
                description: 'Please enter some numbers to sort.',
                variant: 'destructive',
            });
            return;
        }

        try {
            // Split by commas, spaces, or newlines, and filter out empty strings
            const numbers = inputText
                .split(/[\s,]+/)
                .filter(s => s.trim() !== '')
                .map(s => {
                    const num = parseFloat(s);
                    if (isNaN(num)) {
                        throw new Error(`Invalid item found: "${s}" is not a number.`);
                    }
                    return num;
                });
            
            if(numbers.length === 0) {
                 toast({
                    title: 'No Numbers Found',
                    description: 'Could not find any numbers to sort.',
                    variant: 'destructive',
                });
                return;
            }

            if (sortOrder === 'asc') {
                numbers.sort((a, b) => a - b);
            } else {
                numbers.sort((a, b) => b - a);
            }

            setOutputText(numbers.join(', '));
            toast({
                title: 'Success!',
                description: 'Numbers have been sorted.',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'An unexpected error occurred during sorting.',
                variant: 'destructive',
            });
        }
    };

    const copyToClipboard = () => {
        if (!outputText) {
            toast({
                title: "Nothing to Copy",
                description: "There is no sorted text to copy.",
                variant: "destructive"
            });
            return;
        }
        navigator.clipboard.writeText(outputText);
        toast({
            title: "Copied!",
            description: "The sorted list has been copied to your clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <ArrowDownUp className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Number Sorter</CardTitle>
                        <CardDescription>Sort a list of numbers in ascending or descending order.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                           <label className="font-medium">Input Numbers</label>
                           <Textarea
                                placeholder="Enter numbers separated by spaces, commas, or newlines..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="min-h-[150px] font-mono text-sm"
                           />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <RadioGroup defaultValue="asc" value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')} className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="asc" id="asc" />
                                    <Label htmlFor="asc" className="flex items-center gap-2 cursor-pointer"><SortAsc className="h-5 w-5" /> Ascending</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="desc" id="desc" />
                                    <Label htmlFor="desc" className="flex items-center gap-2 cursor-pointer"><SortDesc className="h-5 w-5" /> Descending</Label>
                                </div>
                            </RadioGroup>
                            <Button onClick={handleSort} size="lg">
                                <ArrowDownUp className="mr-2" /> Sort Numbers
                            </Button>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label className="font-medium">Sorted Numbers</label>
                                <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!outputText}>
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </div>
                           <Textarea
                                placeholder="Sorted numbers will appear here..."
                                value={outputText}
                                readOnly
                                className="min-h-[150px] font-mono text-sm bg-muted"
                           />
                        </div>
                    </CardContent>
                </Card>

                {numberSorterGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{numberSorterGuide.title}</CardTitle>
                                        <CardDescription>{numberSorterGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {numberSorterGuide.steps.map((step, stepIndex) => (
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
