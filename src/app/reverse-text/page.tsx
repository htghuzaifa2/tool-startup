"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeftRight, Copy } from 'lucide-react';

export default function ReverseTextPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const { toast } = useToast();

    const handleReverse = (mode: 'chars' | 'words' | 'lines') => {
        if (!input) return;

        let result = '';
        if (mode === 'chars') {
            result = input.split('').reverse().join('');
        } else if (mode === 'words') {
             // Reverse words in each line or whole text? usually whole text words
             // Let's preserve lines but reverse words in them? Or just split by space?
             // "Hello World" -> "World Hello"
             result = input.split(/\s+/).reverse().join(' ');
        } else if (mode === 'lines') {
            result = input.split('\n').reverse().join('\n');
        }
        
        setOutput(result);
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast({
            title: "Copied!",
            description: "Result copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <ArrowLeftRight className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Reverse Text</h1>
                    <p className="text-muted-foreground mt-2">
                        Reverse characters, words, or lines in your text.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Text</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Enter text to reverse..."
                                className="min-h-[300px]"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <Button onClick={() => handleReverse('chars')} variant="outline" title="Reverse Characters">
                                    Chars
                                </Button>
                                <Button onClick={() => handleReverse('words')} variant="outline" title="Reverse Words">
                                    Words
                                </Button>
                                <Button onClick={() => handleReverse('lines')} variant="outline" title="Reverse Lines">
                                    Lines
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Reversed Text</CardTitle>
                             <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                readOnly
                                value={output}
                                className="min-h-[300px] bg-muted/50"
                                placeholder="Reversed text will appear here..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
