"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';
import { z } from 'zod';

// Define the schema for the input data validation
const SummarizeInputSchema = z.object({
    text: z.string().min(50, { message: 'Please enter at least 50 characters to summarize.' }),
});

// Declare puter as a global variable (loaded from Puter.js script)
declare const puter: {
    ai: {
        chat: (prompt: string) => Promise<{ message: { content: string } }>;
    };
};

export default function TextSummarizerPage() {
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const summarizerGuide = guides.find(g => g.href.includes('text-summarizer'));

    const handleGuideClick = () => {
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80;
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    };

    const handleSummarize = async () => {
        const validation = SummarizeInputSchema.safeParse({ text: inputText });
        if (!validation.success) {
            toast({
                title: "Input Error",
                description: validation.error.errors[0].message,
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setSummary('');

        try {
            // Check if puter is available
            if (typeof puter === 'undefined') {
                throw new Error("AI service is not available. Please refresh the page and try again.");
            }

            // Use Puter AI for client-side summarization
            const response = await puter.ai.chat(
                `You are an expert at summarizing text. Your goal is to provide a concise summary of the given content in a few key sentences. 

Analyze the following text and provide a summary:

---
${inputText}
---

Summary:`
            );

            if (response && response.message && response.message.content) {
                setSummary(response.message.content);
                toast({ title: "Success!", description: "Your text has been summarized." });
            } else {
                throw new Error("The summarization service returned an empty response.");
            }
        } catch (error: unknown) {
            console.error("Summarization error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
            toast({
                title: "Summarization Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Wand2 className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">AI Text Summarizer</CardTitle>
                        <CardDescription>Paste any article or paragraph and let AI summarize it for you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <label className="font-medium flex items-center gap-2"><FileText className="w-5 h-5" />Input Text</label>
                            <Textarea
                                placeholder="Paste the text you want to summarize here..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="min-h-[250px] font-mono text-sm"
                            />
                        </div>

                        <div className="text-center">
                            <Button onClick={handleSummarize} size="lg" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Summarizing...</> : <><Wand2 className="mr-2" /> Summarize</>}
                            </Button>
                        </div>

                        {summary && (
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <label className="font-medium">Summary</label>
                                </div>
                                <Card className="min-h-[150px] bg-muted">
                                    <CardContent className="p-4 text-sm">
                                        {summary}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {summarizerGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{summarizerGuide.title}</CardTitle>
                                        <CardDescription>{summarizerGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {summarizerGuide.steps.map((step, stepIndex) => (
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
