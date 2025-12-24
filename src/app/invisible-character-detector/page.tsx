"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Ghost, Search } from 'lucide-react';

export default function InvisibleCharacterDetector() {
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const [stats, setStats] = useState('');
    const { toast } = useToast();

    const detectInvisible = () => {
        if (!inputText) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        // Common invisible characters
        const invisibleChars: { [key: string]: string } = {
            '\u200B': '[ZWSP]', // Zero Width Space
            '\u200C': '[ZWNJ]', // Zero Width Non-Joiner
            '\u200D': '[ZWJ]',  // Zero Width Joiner
            '\u2060': '[WJ]',   // Word Joiner
            '\uFEFF': '[BOM]',  // Byte Order Mark
            '\u00A0': '[NBSP]', // Non-Breaking Space
            '\t': '[TAB]',
        };

        let detectedCount = 0;
        let highlightedText = '';
        
        // We will build the string character by character
        for (let i = 0; i < inputText.length; i++) {
            const char = inputText[i];
            if (invisibleChars[char]) {
                highlightedText += invisibleChars[char];
                detectedCount++;
            } else {
                highlightedText += char;
            }
        }

        setResultText(highlightedText);
        setStats(`Found ${detectedCount} invisible character(s).`);
    };

    const copyToClipboard = () => {
        if (!resultText) return;
        navigator.clipboard.writeText(resultText);
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
                        Invisible Character Detector
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Find hidden characters like zero-width space, ZWNJ, and others in your text.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Ghost className="w-6 h-6 text-primary" />
                            Detector
                        </CardTitle>
                        <CardDescription>Paste text to reveal invisible characters.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="Paste text here..."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={detectInvisible} className="flex-1">
                                <Search className="w-4 h-4 mr-2" />
                                Detect Characters
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setResultText(''); setStats(''); }}>
                                Clear
                            </Button>
                        </div>

                        {stats && <p className="text-sm font-medium text-primary">{stats}</p>}

                        <div className="space-y-2">
                            <Label htmlFor="output">Result (Invisible chars replaced with tags)</Label>
                            <div className="relative">
                                <Textarea
                                    id="output"
                                    className="min-h-[150px] font-mono"
                                    value={resultText}
                                    readOnly
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2 h-8"
                                    onClick={copyToClipboard}
                                    disabled={!resultText}
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
