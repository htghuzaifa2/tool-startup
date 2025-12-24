"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Hash, RefreshCw } from 'lucide-react';

export default function HashtagGenerator() {
    const [inputText, setInputText] = useState('');
    const [hashtags, setHashtags] = useState('');
    const { toast } = useToast();

    const generateHashtags = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text to generate hashtags from.",
                variant: "destructive"
            });
            return;
        }

        // Split by spaces, remove punctuation, filter short words
        const words = inputText
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2); // Ignore words with 2 or fewer chars

        // Remove duplicates and add #
        const uniqueTags = Array.from(new Set(words))
            .map(word => `#${word}`)
            .join(' ');

        setHashtags(uniqueTags);
        toast({
            title: "Generated!",
            description: "Hashtags generated successfully.",
        });
    };

    const copyToClipboard = () => {
        if (!hashtags) return;
        navigator.clipboard.writeText(hashtags);
        toast({
            title: "Copied!",
            description: "Hashtags copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Hashtag Generator
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Generate hashtags from your content to increase reach on social media.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Hash className="w-6 h-6 text-primary" />
                            Generator
                        </CardTitle>
                        <CardDescription>Paste your post content below to get relevant hashtags.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Content</Label>
                            <Textarea
                                id="input-text"
                                placeholder="I love coding in React and Next.js! It's amazing."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={generateHashtags} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Generate Hashtags
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setHashtags(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">Generated Hashtags</Label>
                            <div className="relative">
                                <Textarea
                                    id="output"
                                    placeholder="#love #coding #react #nextjs #amazing"
                                    className="min-h-[150px] text-primary font-medium"
                                    value={hashtags}
                                    readOnly
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2 h-8"
                                    onClick={copyToClipboard}
                                    disabled={!hashtags}
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
