"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Eraser, ListX } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function RemoveDuplicateLines() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(true);
    const { toast } = useToast();

    const removeDuplicates = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        const lines = inputText.split('\n');
        const uniqueLines = new Set();
        const resultLines: string[] = [];

        lines.forEach(line => {
            const checkLine = caseSensitive ? line : line.toLowerCase();
            if (!uniqueLines.has(checkLine)) {
                uniqueLines.add(checkLine);
                resultLines.push(line);
            }
        });

        setOutputText(resultLines.join('\n'));
        toast({
            title: "Duplicates Removed",
            description: `Removed ${lines.length - resultLines.length} duplicate lines.`,
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
                        Remove Duplicate Lines
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Eliminate duplicate lines from a text block instantly.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ListX className="w-6 h-6 text-primary" />
                            Duplicate Remover
                        </CardTitle>
                        <CardDescription>Paste your text below to remove duplicates.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="Apple&#10;Banana&#10;Apple&#10;Orange"
                                className="min-h-[200px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="case-sensitive" checked={caseSensitive} onCheckedChange={setCaseSensitive} />
                            <Label htmlFor="case-sensitive">Case Sensitive (Treat 'Apple' and 'apple' as different)</Label>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={removeDuplicates} className="flex-1">
                                <Eraser className="w-4 h-4 mr-2" />
                                Remove Duplicates
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setOutputText(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output-text">Unique Lines</Label>
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
