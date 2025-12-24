"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Sparkles, Eraser } from 'lucide-react';

export default function WhitespaceCleaner() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const { toast } = useToast();

    const cleanWhitespace = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        let cleaned = inputText
            .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
            .replace(/^\s+|\s+$/gm, '') // Trim start/end of each line
            .replace(/\n\s*\n/g, '\n'); // Remove empty lines (optional, but "remove extra spaces, tabs, and empty lines" implies it)

        // If the user wants strictly "remove empty lines", we can do .replace(/^\s*[\r\n]/gm, '')
        // Let's stick to the description: "clean up your text by removing extra spaces, tabs, and empty lines"
        cleaned = cleaned.replace(/^\s*[\r\n]/gm, '');

        setOutputText(cleaned);
        toast({
            title: "Cleaned!",
            description: "Whitespace removed successfully.",
        });
    };

    const copyToClipboard = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText);
        toast({
            title: "Copied!",
            description: "Cleaned text copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Whitespace Cleaner
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Clean up your text by removing extra spaces, tabs, and empty lines.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Cleaner
                        </CardTitle>
                        <CardDescription>Paste text below to normalize whitespace.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="   Too    many    spaces   and
                                
                                empty lines."
                                className="min-h-[200px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={cleanWhitespace} className="flex-1">
                                <Eraser className="w-4 h-4 mr-2" />
                                Clean Whitespace
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setOutputText(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">Cleaned Text</Label>
                            <div className="relative">
                                <Textarea
                                    id="output"
                                    className="min-h-[200px]"
                                    value={outputText}
                                    readOnly
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
