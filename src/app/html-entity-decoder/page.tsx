
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, CodeXml, ArrowRightLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


// Using a div element's textContent to decode entities
const decodeHtml = (html: string): string => {
    if (typeof window === 'undefined') return '';
    try {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    } catch (e) {
        console.error(e);
        return "Invalid HTML entities provided.";
    }
};

// Simple regex-based encoding
const encodeHtml = (str: string): string => {
    const entityMap: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    return str.replace(/[&<>"']/g, (s) => entityMap[s]);
};


export default function HtmlEscaperUnescaperPage() {
    const [input, setInput] = useState('<p class="greeting">Hello & Welcome!</p>');
    const [output, setOutput] = useState('');
    const { toast } = useToast();
    const htmlEscaperGuide = guides.find(g => g.href.includes('html-entity-decoder'));

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

    const handleEncode = () => {
        setOutput(encodeHtml(input));
        toast({ title: 'Success', description: 'Text has been HTML-encoded.' });
    };

    const handleDecode = () => {
        setOutput(decodeHtml(input));
        toast({ title: 'Success', description: 'Text has been HTML-decoded.' });
        };

    const copyToClipboard = () => {
        if (!output) {
            toast({ title: "Nothing to Copy", variant: "destructive" });
            return;
        }
        navigator.clipboard.writeText(output);
        toast({ title: "Copied!", description: "Output text copied to clipboard." });
    };
    
    const swapContent = () => {
        setInput(output);
        setOutput(input);
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <CodeXml className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">HTML Entity Decoder</CardTitle>
                        <CardDescription>Encode special characters to HTML entities and decode them back.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="input-text">Input</Label>
                            <Textarea
                                id="input-text"
                                placeholder="&lt;p&gt;Hello World&lt;/p&gt;"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="min-h-[200px] font-mono text-sm"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                            <Button onClick={handleEncode}>Encode &rarr;</Button>
                            <Button variant="outline" size="icon" onClick={swapContent}>
                                <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                            <Button onClick={handleDecode}>&larr; Decode</Button>
                        </div>
                        
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="output-text">Output</Label>
                                <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!output}>
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </div>
                            <Textarea
                                id="output-text"
                                placeholder="Output will appear here..."
                                value={output}
                                readOnly
                                className="min-h-[200px] font-mono text-sm bg-muted"
                            />
                        </div>
                    </CardContent>
                </Card>

                 {htmlEscaperGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{htmlEscaperGuide.title}</CardTitle>
                                        <CardDescription>{htmlEscaperGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {htmlEscaperGuide.steps.map((step, stepIndex) => (
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
