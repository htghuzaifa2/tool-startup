"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Wand2, RefreshCw } from 'lucide-react';

declare global {
    interface Window {
        puter?: any;
    }
}

export default function SynonymEnhancer() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const enhanceText = async () => {
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
                `Enhance the following text by replacing simple words with more descriptive, professional, or eloquent synonyms. Maintain the original meaning but improve the vocabulary. Return ONLY the enhanced text, nothing else.\n\nText: "${inputText}"`
            );
            
            const enhanced = response?.message?.content || response?.toString();
            if (enhanced) {
                setOutputText(enhanced.trim());
                toast({
                    title: "Enhanced!",
                    description: "Your text has been improved with better synonyms.",
                });
            }
        } catch (error) {
            console.error("AI Error:", error);
            toast({
                title: "Error",
                description: "Failed to enhance text. Please try again.",
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
            description: "Enhanced text copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Synonym Enhancer
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Enhance your sentences by replacing words with better synonyms using AI.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wand2 className="w-6 h-6 text-primary" />
                            Enhancer
                        </CardTitle>
                        <CardDescription>Enter text to upgrade its vocabulary.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="The movie was good and the actors were nice."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={enhanceText} disabled={loading} className="flex-1">
                                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                {loading ? "Enhancing..." : "Enhance Text"}
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setOutputText(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">Enhanced Text</Label>
                            <div className="relative">
                                <Textarea
                                    id="output"
                                    className="min-h-[150px]"
                                    value={outputText}
                                    readOnly
                                    placeholder="Enhanced version will appear here..."
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
