"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, PenTool, RefreshCw } from 'lucide-react';

declare global {
    interface Window {
        puter?: any;
    }
}

export default function SentenceRewriter() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const rewriteText = async () => {
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
                `Rewrite the following text to make it clearer, more concise, and engaging. Maintain the original meaning but change the structure and vocabulary. Return ONLY the rewritten text.\n\nText: "${inputText}"`
            );
            
            const rewritten = response?.message?.content || response?.toString();
            if (rewritten) {
                setOutputText(rewritten.trim());
                toast({
                    title: "Rewritten!",
                    description: "Your text has been rewritten successfully.",
                });
            }
        } catch (error) {
            console.error("AI Error:", error);
            toast({
                title: "Error",
                description: "Failed to rewrite text. Please try again.",
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
            description: "Rewritten text copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Sentence Rewriter
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Automatically rewrite text by replacing words with synonyms and improving structure.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PenTool className="w-6 h-6 text-primary" />
                            Rewriter
                        </CardTitle>
                        <CardDescription>Paste text to get a fresh version.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="The meeting was very long and boring."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={rewriteText} disabled={loading} className="flex-1">
                                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <PenTool className="w-4 h-4 mr-2" />}
                                {loading ? "Rewriting..." : "Rewrite Text"}
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setOutputText(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">Rewritten Text</Label>
                            <div className="relative">
                                <Textarea
                                    id="output"
                                    className="min-h-[150px]"
                                    value={outputText}
                                    readOnly
                                    placeholder="Rewritten version will appear here..."
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
