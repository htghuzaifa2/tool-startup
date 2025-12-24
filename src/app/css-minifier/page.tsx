
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { ArrowDown, Copy, Palette } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function CssMinifierPage() {
    const [cssInput, setCssInput] = useState('/* Example CSS */\nbody {\n    font-family: sans-serif;\n    line-height: 1.5;\n    background-color: #f0f2f5;\n}');
    const [minifiedCss, setMinifiedCss] = useState('');
    const { toast } = useToast();
    const cssMinifierGuide = guides.find(g => g.href.includes('css-minifier'));

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

    const handleMinify = () => {
        if (!cssInput.trim()) {
            toast({
                title: 'Nothing to Minify',
                description: 'Please paste your CSS code first.',
                variant: 'destructive',
            });
            return;
        }

        try {
            // A simple but effective minification process
            let minified = cssInput
                .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1') // Remove comments
                .replace(/[\r\n\t]/g, '')       // Remove line breaks and tabs
                .replace(/\s+/g, ' ')          // Collapse whitespace
                .replace(/\s*:\s*/g, ':')      // Remove space around colons
                .replace(/\s*;\s*/g, ';')      // Remove space around semicolons
                .replace(/\s*,\s*/g, ',')      // Remove space around commas
                .replace(/\s*\{\s*/g, '{')     // Remove space before opening brace
                .replace(/\s*\}\s*/g, '}')     // Remove space before closing brace
                .replace(/;}/g, '}')           // Remove trailing semicolon in a rule
                .trim();

            setMinifiedCss(minified);
            toast({
                title: 'Success!',
                description: 'CSS has been minified.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred during minification.',
                variant: 'destructive',
            });
        }
    };

    const copyToClipboard = () => {
        if (!minifiedCss) {
            toast({
                title: "Nothing to Copy",
                description: "There is no minified CSS to copy.",
                variant: "destructive"
            });
            return;
        }
        navigator.clipboard.writeText(minifiedCss);
        toast({
            title: "Copied!",
            description: "Minified CSS copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Palette className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">CSS Minifier</CardTitle>
                        <CardDescription>Paste your CSS to remove spaces, line breaks, and comments.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                           <label className="font-medium">Original CSS</label>
                           <Textarea
                                placeholder="body {\n    color: #333;\n}"
                                value={cssInput}
                                onChange={(e) => setCssInput(e.target.value)}
                                className="min-h-[250px] font-mono text-sm"
                           />
                        </div>
                        
                        <div className="text-center">
                            <Button onClick={handleMinify} size="lg">
                                <ArrowDown className="mr-2" /> Minify CSS
                            </Button>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label className="font-medium">Minified CSS</label>
                                <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!minifiedCss}>
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </div>
                           <Textarea
                                placeholder="Minified output will appear here..."
                                value={minifiedCss}
                                readOnly
                                className="min-h-[250px] font-mono text-sm bg-muted"
                           />
                        </div>
                    </CardContent>
                </Card>

                {cssMinifierGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{cssMinifierGuide.title}</CardTitle>
                                        <CardDescription>{cssMinifierGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {cssMinifierGuide.steps.map((step, stepIndex) => (
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
