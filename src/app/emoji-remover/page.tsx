"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Smile, Ban } from 'lucide-react';

export default function EmojiRemover() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const { toast } = useToast();

    const removeEmojis = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        // Regex to match emojis
        // This is a comprehensive regex for emojis
        const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{1F200}-\u{1F270}]/gu;
        
        const cleaned = inputText.replace(emojiRegex, '');
        
        setOutputText(cleaned);
        toast({
            title: "Emojis Removed",
            description: "All emojis have been stripped from the text.",
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
                        Emoji Remover
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Strip all emojis from your input text instantly.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Ban className="w-6 h-6 text-primary" />
                            Emoji Remover
                        </CardTitle>
                        <CardDescription>Paste text to remove emojis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="Hello World! 👋😃"
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={removeEmojis} className="flex-1">
                                <Smile className="w-4 h-4 mr-2" />
                                Remove Emojis
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setOutputText(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">Clean Text</Label>
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
