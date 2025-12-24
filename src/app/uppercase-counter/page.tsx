"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Type, Calculator } from 'lucide-react';

export default function UppercaseCounter() {
    const [inputText, setInputText] = useState('');
    const [count, setCount] = useState<number | null>(null);
    const { toast } = useToast();

    const countUppercase = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        const words = inputText.split(/\s+/);
        // Check if word is all uppercase and contains at least one letter
        const uppercaseWords = words.filter(word => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '');
            return cleanWord.length > 0 && cleanWord === cleanWord.toUpperCase();
        });
        
        setCount(uppercaseWords.length);
        toast({
            title: "Counted!",
            description: `Found ${uppercaseWords.length} uppercase word(s).`,
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Uppercase Counter
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Count how many words are written in ALL CAPS in your text.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Type className="w-6 h-6 text-primary" />
                            Counter
                        </CardTitle>
                        <CardDescription>Paste text to count uppercase words.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="This is a TEST sentence with SOME uppercase WORDS."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={countUppercase} className="flex-1">
                                <Calculator className="w-4 h-4 mr-2" />
                                Count Uppercase Words
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setCount(null); }}>
                                Clear
                            </Button>
                        </div>

                        {count !== null && (
                            <div className="p-6 bg-muted rounded-lg text-center">
                                <p className="text-sm text-muted-foreground mb-1">Uppercase Words Count</p>
                                <p className="text-4xl font-bold text-primary">{count}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
