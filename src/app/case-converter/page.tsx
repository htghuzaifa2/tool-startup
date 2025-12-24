"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, CaseSensitive, RefreshCw, Type, ArrowRightLeft } from 'lucide-react';

export default function CaseConverter() {
    const [text, setText] = useState('');
    const { toast } = useToast();

    const toUpperCase = () => setText(text.toUpperCase());
    const toLowerCase = () => setText(text.toLowerCase());
    
    const toSentenceCase = () => {
        setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()));
    };

    const toTitleCase = () => {
        setText(
            text.toLowerCase().split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
        );
    };

    const toAlternatingCase = () => {
        setText(text.split('').map((c, i) => 
            i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
        ).join(''));
    };

    const toInverseCase = () => {
        setText(text.split('').map(c => 
            c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        ).join(''));
    };

    const copyToClipboard = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Text copied to clipboard.",
        });
    };

    const clearText = () => {
        setText('');
        toast({
            title: "Cleared",
            description: "Text area cleared.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <CaseSensitive className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Case Converter</CardTitle>
                        <CardDescription>Convert text to Uppercase, Lowercase, Title Case, Sentence Case, and more.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Your Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="Type or paste your text here..."
                                className="min-h-[200px]"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Button onClick={toUpperCase} variant="outline">UPPERCASE</Button>
                            <Button onClick={toLowerCase} variant="outline">lowercase</Button>
                            <Button onClick={toSentenceCase} variant="outline">Sentence case</Button>
                            <Button onClick={toTitleCase} variant="outline">Title Case</Button>
                            <Button onClick={toAlternatingCase} variant="outline">aLtErNaTiNg cAsE</Button>
                            <Button onClick={toInverseCase} variant="outline">InVeRsE CaSe</Button>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={copyToClipboard} className="flex-1">
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Text
                            </Button>
                            <Button onClick={clearText} variant="secondary" className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>About Case Converter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>UPPERCASE:</strong> Converts all letters to capitals.</li>
                            <li><strong>lowercase:</strong> Converts all letters to small letters.</li>
                            <li><strong>Sentence case:</strong> Capitalizes the first letter of each sentence.</li>
                            <li><strong>Title Case:</strong> Capitalizes the first letter of every word.</li>
                            <li><strong>Alternating Case:</strong> Alternates between lower and upper case (e.g., tExT).</li>
                            <li><strong>Inverse Case:</strong> Flips the case of every letter.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
