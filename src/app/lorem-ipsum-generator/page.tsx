
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, Pilcrow, RefreshCw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const loremIpsumWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vitae', 'diam', 'non', 'erat', 'mattis', 'placerat', 'sed', 'vel', 'urna', 'nullam', 'quis', 'ante', 'etiam', 'sit', 'amet', 'orci', 'eget', 'eros', 'faucibus', 'scelerisque', 'vivamus', 'eget', 'arcu', 'vel', 'quam', 'egestas', 'semper', 'aenean', 'posuere', 'quam', 'vel', 'leo', 'ultricies', 'nec', 'lacinia', 'risus', 'fermentum', 'donec', 'et', 'dui', 'purus', 'cras', 'eu', 'lorem', 'ac', 'risus', 'aliquam', 'euismod', 'quis', 'ac', 'nibh', 'fusce', 'ac', 'urna', 'vel', 'odio', 'tristique', 'tincidunt', 'quis', 'eu', 'enim', 'in', 'hac', 'habitasse', 'platea', 'dictumst', 'maecenas', 'ut', 'lorem', 'quis', 'ligula', 'imperdiet', 'auctor', 'sed', 'eu', 'arcu', 'morbi', 'et', 'erat', 'et', 'nibh', 'condimentum', 'interdum', 'eu', 'ac', 'ligula', 'integer', 'eu', 'lacus', 'sit', 'amet', 'augue', 'congue', 'hendrerit', 'in', 'vel', 'elit', 'phasellus', 'non', 'enim', 'quis', 'orci', 'consequat', 'consequat', 'ac', 'sit', 'amet', 'nisi', 'praesent', 'in', 'nisi', 'id', 'ante', 'molestie', 'ultrices', 'sed', 'non', 'nisi', 'quisque', 'porttitor', 'eros', 'in', 'tellus', 'semper', 'accumsan'
];

function generateLoremIpsum(wordCount: number): string {
    if (wordCount <= 0) return '';
    let result: string[] = [];
    while (result.length < wordCount) {
        result = result.concat(loremIpsumWords);
    }
    result = result.slice(0, wordCount);
    
    // Simple sentence and paragraph structure
    let text = result.join(' ');
    text = text.charAt(0).toUpperCase() + text.slice(1); // Capitalize first letter
    
    // Add periods at reasonable intervals
    let wordCounter = 0;
    text = text.replace(/\s+/g, (match) => {
        wordCounter++;
        if (wordCounter % (Math.floor(Math.random() * 5) + 8) === 0) {
            return '. ';
        }
        return match;
    });

    // Capitalize after periods
    text = text.replace(/\.\s+([a-z])/g, (match) => match.toUpperCase());
    
    if (!text.endsWith('.')) {
        text += '.';
    }

    return text;
}

export default function LoremIpsumGeneratorPage() {
    const [wordCount, setWordCount] = useState(50);
    const [generatedText, setGeneratedText] = useState('');
    const { toast } = useToast();
    const loremIpsumGuide = guides.find(g => g.href.includes('lorem-ipsum-generator'));

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

    const handleGenerate = () => {
        if (wordCount > 0) {
            setGeneratedText(generateLoremIpsum(wordCount));
        } else {
            setGeneratedText('');
        }
    };
    
    const copyToClipboard = () => {
        if (!generatedText) {
            toast({ title: "Nothing to Copy", variant: "destructive" });
            return;
        }
        navigator.clipboard.writeText(generatedText);
        toast({ title: "Copied!", description: "Lorem Ipsum text copied to clipboard." });
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Pilcrow className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Lorem Ipsum Generator</CardTitle>
                        <CardDescription>Generate placeholder text with a specific word count.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-end gap-4">
                            <div className="w-full sm:w-auto flex-grow">
                                <Label htmlFor="word-count" className="font-medium">Number of Words</Label>
                                <Input
                                    id="word-count"
                                    type="number"
                                    value={wordCount}
                                    onChange={(e) => setWordCount(parseInt(e.target.value, 10))}
                                    min="1"
                                    className="mt-2"
                                />
                            </div>
                            <div className="self-end">
                                <Button onClick={handleGenerate} size="lg">
                                    <RefreshCw className="mr-2 h-4 w-4" /> Generate Text
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label className="font-medium">Generated Text</label>
                                <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!generatedText}>
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </div>
                           <Textarea
                                placeholder="Generated Lorem Ipsum text will appear here..."
                                value={generatedText}
                                readOnly
                                className="min-h-[250px] font-mono text-sm bg-muted"
                           />
                        </div>
                    </CardContent>
                </Card>

                {loremIpsumGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{loremIpsumGuide.title}</CardTitle>
                                        <CardDescription>{loremIpsumGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {loremIpsumGuide.steps.map((step, stepIndex) => (
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
