"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Binary, Copy } from 'lucide-react';

export default function ExtractNumbersPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const { toast } = useToast();

    const handleExtract = () => {
        if (!input) {
            setOutput('');
            return;
        }

        // Regex to find numbers (integers and floats)
        const numbers = input.match(/-?\d+(\.\d+)?/g);
        
        if (numbers) {
            setOutput(numbers.join('\n'));
        } else {
             setOutput('No numbers found.');
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast({
            title: "Copied!",
            description: "Numbers copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <Binary className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Extract Numbers</h1>
                    <p className="text-muted-foreground mt-2">
                        Extract only numbers from a block of text.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Text</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Text with numbers like 123, 45.67, etc."
                                className="min-h-[300px]"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button className="mt-4 w-full" onClick={handleExtract}>
                                Extract Numbers
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Extracted Numbers</CardTitle>
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
                                placeholder="Numbers will be listed here..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
