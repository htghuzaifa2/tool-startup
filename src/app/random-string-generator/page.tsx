"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Dna } from 'lucide-react';

export default function RandomStringGenerator() {
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [generatedString, setGeneratedString] = useState('');
    const { toast } = useToast();

    const generateString = () => {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let charPool = '';
        if (includeUppercase) charPool += uppercaseChars;
        if (includeLowercase) charPool += lowercaseChars;
        if (includeNumbers) charPool += numberChars;
        if (includeSymbols) charPool += symbolChars;

        if (!charPool) {
            toast({
                title: "Error",
                description: "Please select at least one character type.",
                variant: "destructive"
            });
            return;
        }

        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            result += charPool[randomIndex];
        }

        setGeneratedString(result);
    };

    const copyToClipboard = () => {
        if (!generatedString) return;
        navigator.clipboard.writeText(generatedString);
        toast({
            title: "Copied!",
            description: "String copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Random String Generator
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Generate secure random strings of customizable length.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Dna className="w-6 h-6 text-primary" />
                            Generator
                        </CardTitle>
                        <CardDescription>Configure your options and generate.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Length: {length}</Label>
                                <Slider
                                    value={[length]}
                                    onValueChange={(vals) => setLength(vals[0])}
                                    min={1}
                                    max={128}
                                    step={1}
                                />
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                                <div className="flex items-center space-x-2">
                                    <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                                    <Label htmlFor="uppercase">A-Z</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                                    <Label htmlFor="lowercase">a-z</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                                    <Label htmlFor="numbers">0-9</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                                    <Label htmlFor="symbols">!@#$</Label>
                                </div>
                            </div>
                        </div>

                        <Button onClick={generateString} className="w-full">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Generate String
                        </Button>

                        <div className="space-y-2">
                            <Label htmlFor="output">Generated String</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="output"
                                    value={generatedString}
                                    readOnly
                                    className="font-mono text-center text-lg"
                                />
                                <Button onClick={copyToClipboard} disabled={!generatedString}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
