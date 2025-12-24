"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Binary, RefreshCw } from 'lucide-react';

export default function TextToAscii() {
    const [inputText, setInputText] = useState('');
    const [output, setOutput] = useState('');
    const { toast } = useToast();

    const convertToAscii = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        const asciiCodes = inputText
            .split('')
            .map(char => char.charCodeAt(0))
            .join(' ');

        setOutput(asciiCodes);
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast({
            title: "Copied!",
            description: "ASCII codes copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Text to ASCII Converter
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Convert regular text into ASCII character codes instantly.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Binary className="w-6 h-6 text-primary" />
                            ASCII Converter
                        </CardTitle>
                        <CardDescription>Enter text below to convert to ASCII values.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="Hello World"
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={convertToAscii} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Convert to ASCII
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setOutput(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">ASCII Output (Space Separated)</Label>
                            <div className="relative">
                                <Textarea
                                    id="output"
                                    placeholder="72 101 108 108 111..."
                                    className="min-h-[150px] font-mono"
                                    value={output}
                                    readOnly
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2 h-8"
                                    onClick={copyToClipboard}
                                    disabled={!output}
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
