"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Languages, RefreshCw } from 'lucide-react';

declare global {
    interface Window {
        puter?: any;
    }
}

export default function ForeignWordDetector() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const detectForeignWords = async () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        if (!window.puter) {
            toast({
                title: "System Error",
                description: "AI service is not available. Please try again later.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            const response = await window.puter.ai.chat(
                `Analyze the following text and identify any words that are NOT in English (foreign words). List them out with their likely language and meaning. If none found, say "No foreign words detected."\n\nText: "${inputText}"`
            );
            
            const result = response?.message?.content || response?.toString();
            if (result) {
                setOutputText(result.trim());
                toast({
                    title: "Analysis Complete",
                    description: "Foreign words detection finished.",
                });
            }
        } catch (error) {
            console.error("AI Error:", error);
            toast({
                title: "Error",
                description: "Failed to detect foreign words. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText);
        toast({
            title: "Copied!",
            description: "Result copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Foreign Word Detector
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Detect foreign or non-English words inside English paragraphs using AI.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Languages className="w-6 h-6 text-primary" />
                            Detector
                        </CardTitle>
                        <CardDescription>Paste English text mixed with other languages.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="The zeitgeist of the era was captured perfectly. He said 'Hola' to everyone."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={detectForeignWords} disabled={loading} className="flex-1">
                                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Languages className="w-4 h-4 mr-2" />}
                                {loading ? "Detecting..." : "Detect Foreign Words"}
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setOutputText(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">Result</Label>
                            <div className="relative">
                                <Textarea
                                    id="output"
                                    className="min-h-[150px]"
                                    value={outputText}
                                    readOnly
                                    placeholder="Detected words will be listed here..."
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2 h-8"
                                    onClick={copyToClipboard}
                                    disabled={!outputText}
                                >
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
