"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Delete, XCircle } from 'lucide-react';

export default function RemoveSymbols() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const { toast } = useToast();

    const removeSymbols = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        // Keep letters, numbers, spaces, and newlines. Remove everything else.
        const cleaned = inputText.replace(/[^a-zA-Z0-9\s\n]/g, '');
        
        setOutputText(cleaned);
        toast({
            title: "Symbols Removed",
            description: "All symbols have been stripped from the text.",
        });
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
                        Remove Symbols
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Strip all symbols and special characters from your text, keeping only letters and numbers.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <XCircle className="w-6 h-6 text-primary" />
                            Symbol Remover
                        </CardTitle>
                        <CardDescription>Paste your text below to clean it.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="Hello! @World# $123..."
                                className="min-h-[200px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={removeSymbols} className="flex-1">
                                <Delete className="w-4 h-4 mr-2" />
                                Remove Symbols
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setOutputText(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output-text">Clean Text</Label>
                            <div className="relative">
                                <Textarea
                                    id="output-text"
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
