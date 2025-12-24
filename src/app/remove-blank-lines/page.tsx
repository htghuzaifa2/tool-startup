"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Eraser, Copy } from 'lucide-react';

export default function RemoveBlankLinesPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const { toast } = useToast();

    const handleRemove = () => {
        if (!input) {
            setOutput('');
            return;
        }

        // Split by newline, filter empty/whitespace-only lines, join
        const lines = input.split('\n');
        const cleanLines = lines.filter(line => line.trim() !== '');
        const result = cleanLines.join('\n');
        
        setOutput(result);
        
        toast({
            title: "Success",
            description: `Removed ${lines.length - cleanLines.length} blank lines.`,
        });
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
                        <Eraser className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Remove Blank Lines</h1>
                    <p className="text-muted-foreground mt-2">
                        Remove all blank lines from your text.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Text</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Paste text with blank lines..."
                                className="min-h-[300px]"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button className="mt-4 w-full" onClick={handleRemove}>
                                Remove Blank Lines
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Cleaned Text</CardTitle>
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
                                placeholder="Text without blank lines will appear here..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
