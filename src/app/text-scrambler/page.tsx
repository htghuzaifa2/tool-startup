"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Shuffle, RefreshCw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function TextScrambler() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [mode, setMode] = useState<'words' | 'letters'>('words');
    const { toast } = useToast();

    const scrambleText = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text to scramble.",
                variant: "destructive"
            });
            return;
        }

        let result = '';

        if (mode === 'words') {
            const words = inputText.split(/\s+/);
            for (let i = words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [words[i], words[j]] = [words[j], words[i]];
            }
            result = words.join(' ');
        } else {
            // Scramble letters but keep words intact? Or scramble entire string?
            // "Randomly shuffle characters or words" - usually means shuffle characters within the whole string or within words.
            // Let's shuffle characters of the entire string for maximum chaos, or per word.
            // Let's do entire string for "letters" mode as it's a scrambler.
            const chars = inputText.split('');
            for (let i = chars.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [chars[i], chars[j]] = [chars[j], chars[i]];
            }
            result = chars.join('');
        }

        setOutputText(result);
    };

    const copyToClipboard = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText);
        toast({
            title: "Copied!",
            description: "Scrambled text copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Text Scrambler
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Randomly shuffle characters or words in your text.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shuffle className="w-6 h-6 text-primary" />
                            Scrambler
                        </CardTitle>
                        <CardDescription>Enter text and choose a scrambling mode.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="The quick brown fox jumps over the lazy dog."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Scramble Mode</Label>
                            <RadioGroup defaultValue="words" onValueChange={(v) => setMode(v as 'words' | 'letters')} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="words" id="words" />
                                    <Label htmlFor="words">Shuffle Words</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="letters" id="letters" />
                                    <Label htmlFor="letters">Shuffle Letters</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={scrambleText} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Scramble
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setOutputText(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">Scrambled Output</Label>
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
