
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, Braces, ArrowRight, Wand2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function JsonFormatterPage() {
    const [jsonInput, setJsonInput] = useState('{"name":"John Doe","age":30,"isStudent":false,"courses":["Math","Science"]}');
    const [jsonOutput, setJsonOutput] = useState('');
    const { toast } = useToast();
    const jsonFormatterGuide = guides.find(g => g.href.includes('json-formatter'));

    const handleGuideClick = () => {
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80;
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    };

    const processJson = (action: 'prettify' | 'minify') => {
        if (!jsonInput.trim()) {
            toast({
                title: 'No Input',
                description: 'Please paste your JSON data first.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const parsedJson = JSON.parse(jsonInput);
            if (action === 'prettify') {
                setJsonOutput(JSON.stringify(parsedJson, null, 4));
                toast({ title: 'Success', description: 'JSON has been prettified.' });
            } else { // minify
                setJsonOutput(JSON.stringify(parsedJson));
                toast({ title: 'Success', description: 'JSON has been minified.' });
            }
        } catch (error: any) {
            setJsonOutput(`Invalid JSON: ${error.message}`);
            toast({
                title: 'Invalid JSON',
                description: 'Please check your JSON syntax.',
                variant: 'destructive',
            });
        }
    };

    const copyToClipboard = () => {
        if (!jsonOutput || jsonOutput.startsWith('Invalid')) {
            toast({ title: "Nothing to Copy", variant: "destructive" });
            return;
        }
        navigator.clipboard.writeText(jsonOutput);
        toast({ title: "Copied!", description: "Formatted JSON copied to clipboard." });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Braces className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">JSON Formatter</CardTitle>
                        <CardDescription>Format, validate, and beautify your JSON data instantly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                           <label className="font-medium">Input JSON</label>
                           <Textarea
                                placeholder='{"key": "value"}'
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                className="min-h-[250px] font-mono text-sm"
                           />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Button onClick={() => processJson('prettify')} size="lg">
                                <Wand2 className="mr-2" /> Prettify
                            </Button>
                             <Button onClick={() => processJson('minify')} size="lg" variant="secondary">
                                Minify
                            </Button>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label className="font-medium">Formatted JSON</label>
                                <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!jsonOutput}>
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </div>
                           <Textarea
                                placeholder="Formatted output will appear here..."
                                value={jsonOutput}
                                readOnly
                                className="min-h-[250px] font-mono text-sm bg-muted"
                           />
                        </div>
                    </CardContent>
                </Card>

                {jsonFormatterGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{jsonFormatterGuide.title}</CardTitle>
                                        <CardDescription>{jsonFormatterGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {jsonFormatterGuide.steps.map((step, stepIndex) => (
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
