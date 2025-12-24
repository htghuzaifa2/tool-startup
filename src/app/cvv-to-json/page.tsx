"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Copy } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function CvvToJsonPage() {
    const [cvv, setCvv] = useState('');
    const [jsonOutput, setJsonOutput] = useState('');
    const { toast } = useToast();

    const handleConvert = () => {
        if (!cvv.trim()) {
             toast({
                title: "Empty Input",
                description: "Please enter CVV data.",
                variant: "destructive"
            });
            return;
        }

        // Assume input might be just a number or raw text. 
        // We'll wrap it in a JSON structure.
        // User request: "Convert card CVV data into JSON structure format."
        // This is a bit ambiguous. Usually means taking raw card data (PAN|EXP|CVV) and making JSON.
        // Or just taking a CVV and wrapping it.
        // Let's assume it parses a common format like "PAN|MM|YY|CVV" or just "CVV".
        
        // Simple implementation: Create a JSON object with the input string as the CVV value, 
        // or try to parse if it looks like a full card string.
        
        const lines = cvv.split('\n');
        const results = lines.map(line => {
             const parts = line.split('|');
             if (parts.length >= 3) {
                 return {
                     pan: parts[0]?.trim(),
                     month: parts[1]?.trim(),
                     year: parts[2]?.trim(),
                     cvv: parts[3]?.trim() || ''
                 };
             } else {
                 return { cvv: line.trim() };
             }
        });

        const output = JSON.stringify(results.length === 1 ? results[0] : results, null, 2);
        setJsonOutput(output);
    };

    const copyToClipboard = () => {
        if (!jsonOutput) return;
        navigator.clipboard.writeText(jsonOutput);
        toast({
            title: "Copied!",
            description: "JSON copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">CVV to JSON</h1>
                    <p className="text-muted-foreground mt-2">
                        Convert card data (Format: CC|MM|YY|CVV) into JSON structure format.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Data</CardTitle>
                            <CardDescription>Enter one per line (CC|MM|YY|CVV)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="1234567890123456|01|25|123"
                                className="min-h-[200px] font-mono"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                            />
                            <Button className="w-full" onClick={handleConvert}>
                                Convert to JSON
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>JSON Output</CardTitle>
                             <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!jsonOutput}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                readOnly
                                value={jsonOutput}
                                className="min-h-[200px] font-mono bg-muted/50"
                                placeholder="JSON will appear here..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
