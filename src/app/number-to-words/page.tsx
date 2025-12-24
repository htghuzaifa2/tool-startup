"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, Type } from 'lucide-react';
import { Label } from "@/components/ui/label";

export default function NumberToWordsPage() {
    const [number, setNumber] = useState('');
    const [words, setWords] = useState('');
    const { toast } = useToast();

    // Helper function to convert number to words
    const convertToWords = (numStr: string): string => {
        const num = parseInt(numStr, 10);
        if (isNaN(num)) return "Invalid Number";
        if (num === 0) return "Zero";

        const a = ['','One ','Two ','Three ','Four ','Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
        const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

        const inWords = (n: number): string => {
            if ((n = n.toString().length > 9 ? parseFloat(n.toString().substring(0,9)) : n) < 20) return a[n];
            const digit = n % 10;
            if (n < 100) return b[Math.floor(n / 10)] + (digit ? '-' + a[digit] : ' ');
            if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 === 0 ? '' : 'and ' + inWords(n % 100));
            if (n < 1000000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
            if (n < 1000000000) return inWords(Math.floor(n / 1000000)) + 'Million ' + (n % 1000000 !== 0 ? inWords(n % 1000000) : '');
            if (n < 1000000000000) return inWords(Math.floor(n / 1000000000)) + 'Billion ' + (n % 1000000000 !== 0 ? inWords(n % 1000000000) : '');
            return "Number too large";
        };

        return inWords(num).trim();
    };

    const handleConvert = () => {
        const result = convertToWords(number);
        setWords(result);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(e.target.value);
        if (e.target.value) {
            setWords(convertToWords(e.target.value));
        } else {
            setWords('');
        }
    };

    const copyToClipboard = () => {
        if (!words) return;
        navigator.clipboard.writeText(words);
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
                        <Type className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Number to Words</h1>
                    <p className="text-muted-foreground mt-2">
                        Convert numbers into written English words instantly.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Number</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Input
                            type="number"
                            placeholder="e.g. 12345"
                            value={number}
                            onChange={handleInputChange}
                            className="text-lg"
                        />
                        
                        <div className="p-6 bg-muted rounded-lg flex flex-col items-center justify-center min-h-[100px] relative group">
                            <p className="text-2xl font-medium text-center break-words w-full">
                                {words || <span className="text-muted-foreground text-base font-normal">Words will appear here...</span>}
                            </p>
                            {words && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={copyToClipboard}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
