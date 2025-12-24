"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Upload, FileType } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

declare const puter: {
    ai: {
        chat: (prompt: string) => Promise<{ message: { content: string } }>;
    };
};

export default function AiSummarizerPage() {
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
            toast({
                title: "Invalid File",
                description: "Please upload a PDF or TXT file.",
                variant: "destructive"
            });
            return;
        }

        setFileName(file.name);
        setIsLoading(true);

        try {
            let text = '';
            if (file.type === 'application/pdf') {
                text = await extractTextFromPdf(file);
            } else {
                text = await file.text();
            }

            if (text.trim()) {
                setInputText(text);
                toast({
                    title: "File Loaded",
                    description: `Successfully extracted text from ${file.name}`,
                });
            } else {
                toast({
                    title: "Empty File",
                    description: "Could not extract text from this file.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to read file.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const extractTextFromPdf = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
        }

        return fullText;
    };

    const handleSummarize = async () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text or upload a file to summarize.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        setSummary('');

        try {
            if (typeof puter === 'undefined') {
                throw new Error("AI service is not available. Please refresh the page.");
            }

            // Limit text length to avoid token limits if necessary, though Puter v2 is generous.
            // Let's truncate to ~15000 chars roughly to be safe if it's huge.
            const truncatedText = inputText.length > 20000 ? inputText.slice(0, 20000) + "... [Truncated]" : inputText;

            const response = await puter.ai.chat(
                `You are an expert at summarizing text. Your goal is to provide a concise summary of the given content in a few key sentences.
                
                Analyze the following text and provide a summary:
                
                ---
                ${truncatedText}
                ---
                
                Summary:`
            );

            if (response && response.message && response.message.content) {
                setSummary(response.message.content);
            } else {
                throw new Error("Empty response from AI.");
            }

        } catch (error: unknown) {
            console.error("Summarization error:", error);
            toast({
                title: "Error",
                description: "Failed to summarize text.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">AI Summarizer</h1>
                    <p className="text-muted-foreground mt-2">
                        Summarize PDF, or Text with AI.
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Content</CardTitle>
                            <CardDescription>Paste text or upload a file</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload PDF/TXT
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.txt"
                                    onChange={handleFileUpload}
                                />
                                {fileName && <span className="text-sm self-center text-muted-foreground">Loaded: {fileName}</span>}
                            </div>
                            
                            <Textarea
                                placeholder="Paste your text here..."
                                className="min-h-[200px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            
                            <Button className="w-full" onClick={handleSummarize} disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {isLoading ? 'Summarizing...' : 'Summarize with AI'}
                            </Button>
                        </CardContent>
                    </Card>

                    {summary && (
                        <Card className="bg-muted/30 border-primary/20">
                            <CardHeader>
                                <CardTitle>Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="leading-relaxed whitespace-pre-wrap">{summary}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
