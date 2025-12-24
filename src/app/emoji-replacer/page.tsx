"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Smile, RefreshCw } from 'lucide-react';

export default function EmojiReplacer() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const { toast } = useToast();

    // Simple dictionary for common words
    const emojiMap: { [key: string]: string } = {
        'happy': '😊',
        'sad': '😢',
        'love': '❤️',
        'like': '👍',
        'cool': '😎',
        'fire': '🔥',
        'star': '⭐',
        'heart': '💖',
        'sun': '☀️',
        'moon': '🌙',
        'dog': '🐶',
        'cat': '🐱',
        'pizza': '🍕',
        'coffee': '☕',
        'music': '🎵',
        'party': '🎉',
        'money': '💰',
        'time': '⏰',
        'world': '🌍',
        'hello': '👋',
        'bye': '👋',
        'yes': '✅',
        'no': '❌',
        'check': '✅',
        'wrong': '❌',
        'smile': '😄',
        'laugh': '😂',
        'cry': '😭',
        'angry': '😠',
        'rocket': '🚀'
    };

    const replaceWithEmojis = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        const words = inputText.split(/(\s+)/); // Split by whitespace but keep delimiters
        const replaced = words.map(word => {
            const lowerWord = word.toLowerCase().replace(/[^\w]/g, ''); // Remove punctuation for lookup
            if (emojiMap[lowerWord]) {
                // Keep original punctuation if any? A bit complex for simple replace.
                // Let's just append emoji or replace word. "Replace common words with emojis" usually means replace.
                return emojiMap[lowerWord];
            }
            return word;
        }).join('');

        setOutputText(replaced);
        toast({
            title: "Replaced!",
            description: "Words replaced with emojis.",
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
                        Emoji Replacer
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Replace common words with emojis to make your text fun.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smile className="w-6 h-6 text-primary" />
                            Replacer
                        </CardTitle>
                        <CardDescription>Enter text like "I love pizza and coffee".</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="I love pizza and coffee!"
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={replaceWithEmojis} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Replace Words
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
