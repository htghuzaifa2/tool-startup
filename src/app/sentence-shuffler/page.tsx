
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, Shuffle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function SentenceShufflerPage() {
    const [inputText, setInputText] = useState('This is the first sentence. This is the second one! And here comes the third?');
    const [shuffledText, setShuffledText] = useState('');
    const { toast } = useToast();
    const sentenceShufflerGuide = guides.find(g => g.href.includes('sentence-shuffler'));

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

    const handleShuffle = () => {
        if (!inputText.trim()) {
            toast({
                title: 'Nothing to Shuffle',
                description: 'Please enter some text first.',
                variant: 'destructive',
            });
            return;
        }

        try {
            // Regex to split text into sentences, keeping delimiters and trailing whitespace.
            // This handles multiple spaces after a delimiter.
            let sentences: string[] = inputText.match(/[^.!?]+[.!?]+[ \t\r\n]*/g) || [];
            
            // Handle case where there might be text without a closing delimiter
            const lastMatchEnd = sentences.length > 0 ? inputText.lastIndexOf(sentences[sentences.length - 1]) + sentences[sentences.length - 1].length : 0;
            const remainingText = inputText.substring(lastMatchEnd).trim();
            if (remainingText) {
                sentences.push(remainingText);
            }

            if (sentences.length <= 1) {
                toast({
                    title: 'Not Enough Sentences',
                    description: 'You need at least two sentences to shuffle.',
                });
                setShuffledText(inputText);
                return;
            }

            // Fisher-Yates shuffle algorithm
            for (let i = sentences.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
            }

            setShuffledText(sentences.join(''));
            toast({
                title: 'Success!',
                description: 'Sentences have been shuffled.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred during shuffling.',
                variant: 'destructive',
            });
        }
    };

    const copyToClipboard = () => {
        if (!shuffledText) {
            toast({
                title: "Nothing to Copy",
                description: "There is no shuffled text to copy.",
                variant: "destructive"
            });
            return;
        }
        navigator.clipboard.writeText(shuffledText);
        toast({
            title: "Copied!",
            description: "Shuffled text copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Shuffle className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Sentence Shuffler</CardTitle>
                        <CardDescription>Randomly shuffle the sentences within your paragraph.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                           <Label htmlFor="input-text">Original Text</Label>
                           <Textarea
                                id="input-text"
                                placeholder="Enter a paragraph with multiple sentences..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="min-h-[200px]"
                           />
                        </div>
                        
                        <div className="text-center">
                            <Button onClick={handleShuffle} size="lg">
                                <Shuffle className="mr-2" /> Shuffle Sentences
                            </Button>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="output-text">Shuffled Text</Label>
                                <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!shuffledText}>
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </div>
                           <Textarea
                                id="output-text"
                                placeholder="Shuffled sentences will appear here..."
                                value={shuffledText}
                                readOnly
                                className="min-h-[200px] bg-muted"
                           />
                        </div>
                    </CardContent>
                </Card>

                {sentenceShufflerGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                           <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{sentenceShufflerGuide.title}</CardTitle>
                                        <CardDescription>{sentenceShufflerGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {sentenceShufflerGuide.steps.map((step, stepIndex) => (
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
