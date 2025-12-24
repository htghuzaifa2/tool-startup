"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Calculator } from 'lucide-react';

export default function SentenceCounter() {
    const [inputText, setInputText] = useState('');
    const [count, setCount] = useState<number | null>(null);
    const { toast } = useToast();

    const countSentences = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        // Split by ., !, ? followed by space or end of string
        // Also handle newlines as sentence breaks if they are standalone
        // Simple regex approach
        const sentences = inputText.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g);
        
        // Filter out empty or whitespace-only matches
        const validSentences = sentences ? sentences.filter(s => s.trim().length > 0) : [];
        
        setCount(validSentences.length);
        toast({
            title: "Counted!",
            description: `Found ${validSentences.length} sentence(s).`,
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Sentence Counter
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Count how many sentences your content contains.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="w-6 h-6 text-primary" />
                            Counter
                        </CardTitle>
                        <CardDescription>Paste text to count sentences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="Hello world. This is a second sentence! And a third?"
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={countSentences} className="flex-1">
                                <Calculator className="w-4 h-4 mr-2" />
                                Count Sentences
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setCount(null); }}>
                                Clear
                            </Button>
                        </div>

                        {count !== null && (
                            <div className="p-6 bg-muted rounded-lg text-center">
                                <p className="text-sm text-muted-foreground mb-1">Sentence Count</p>
                                <p className="text-4xl font-bold text-primary">{count}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
