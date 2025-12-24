"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Trash2, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function DuplicateWordRemover() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(false);
    const { toast } = useToast();

    const removeDuplicateWords = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        const words = inputText.split(/\s+/);
        const seen = new Set();
        const result: string[] = [];

        words.forEach(word => {
            const checkWord = caseSensitive ? word : word.toLowerCase();
            if (!seen.has(checkWord)) {
                seen.add(checkWord);
                result.push(word);
            }
        });

        setOutputText(result.join(' '));
        toast({
            title: "Duplicates Removed",
            description: "Repeated words have been removed.",
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
                        Duplicate Word Remover
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Clean your text by removing repeated words automatically.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trash2 className="w-6 h-6 text-primary" />
                            Remover
                        </CardTitle>
                        <CardDescription>Paste text to remove duplicate words.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="This is is a test test."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="case-sensitive" checked={caseSensitive} onCheckedChange={setCaseSensitive} />
                            <Label htmlFor="case-sensitive">Case Sensitive</Label>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={removeDuplicateWords} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Remove Duplicates
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
