"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { ArrowDownAZ, ArrowUpZA, Copy, Shuffle } from 'lucide-react';

export default function SortLinesPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const { toast } = useToast();

    const handleSort = (direction: 'asc' | 'desc' | 'random') => {
        if (!input) return;

        const lines = input.split('\n');
        let sorted;
        
        if (direction === 'asc') {
            sorted = [...lines].sort();
        } else if (direction === 'desc') {
            sorted = [...lines].sort().reverse();
        } else {
             // Random
             sorted = [...lines].sort(() => Math.random() - 0.5);
        }
        
        setOutput(sorted.join('\n'));
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
                        <ArrowDownAZ className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Sort Lines Alphabetically</h1>
                    <p className="text-muted-foreground mt-2">
                        Sort your text lines from A to Z, Z to A, or randomly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Text</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Enter lines to sort..."
                                className="min-h-[300px]"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <Button onClick={() => handleSort('asc')} variant="outline">
                                    <ArrowDownAZ className="w-4 h-4 mr-2" /> A-Z
                                </Button>
                                <Button onClick={() => handleSort('desc')} variant="outline">
                                    <ArrowUpZA className="w-4 h-4 mr-2" /> Z-A
                                </Button>
                                <Button onClick={() => handleSort('random')} variant="outline">
                                    <Shuffle className="w-4 h-4 mr-2" /> Random
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Sorted Text</CardTitle>
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
                                placeholder="Sorted lines will appear here..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
