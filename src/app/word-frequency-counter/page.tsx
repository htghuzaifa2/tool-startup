"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, BarChart2, RefreshCw } from 'lucide-react';

export default function WordFrequencyCounter() {
    const [inputText, setInputText] = useState('');
    const [frequencyMap, setFrequencyMap] = useState<[string, number][]>([]);
    const { toast } = useToast();

    const analyzeFrequency = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        const words = inputText.toLowerCase().match(/\b\w+\b/g);
        if (!words) {
            setFrequencyMap([]);
            return;
        }

        const counts: { [key: string]: number } = {};
        words.forEach(word => {
            counts[word] = (counts[word] || 0) + 1;
        });

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        setFrequencyMap(sorted);
        
        toast({
            title: "Analyzed!",
            description: `Found ${sorted.length} unique words.`,
        });
    };

    const copyToClipboard = () => {
        if (frequencyMap.length === 0) return;
        const text = frequencyMap.map(([word, count]) => `${word}: ${count}`).join('\n');
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Frequency list copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Word Frequency Counter
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        See which words are repeated the most in your text.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart2 className="w-6 h-6 text-primary" />
                            Analyzer
                        </CardTitle>
                        <CardDescription>Paste text to analyze word usage.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="The quick brown fox jumps over the lazy dog. The dog slept."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={analyzeFrequency} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Analyze Frequency
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setFrequencyMap([]); }}>
                                Clear
                            </Button>
                        </div>

                        {frequencyMap.length > 0 && (
                            <div className="space-y-2">
                                <Label>Frequency List (Top 50)</Label>
                                <div className="relative border rounded-md p-4 bg-muted/50 max-h-[300px] overflow-y-auto">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {frequencyMap.slice(0, 50).map(([word, count]) => (
                                            <div key={word} className="flex justify-between p-2 bg-background rounded shadow-sm">
                                                <span className="font-medium truncate">{word}</span>
                                                <span className="text-muted-foreground">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="absolute top-2 right-2 h-8"
                                        onClick={copyToClipboard}
                                    >
                                        <Copy className="w-4 h-4 mr-1" />
                                        Copy
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
