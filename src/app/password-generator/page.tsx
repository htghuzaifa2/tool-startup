
"use client"

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, KeyRound } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const { toast } = useToast();
    const passwordGeneratorGuide = guides.find(g => g.href.includes('password-generator'));

    const handleGuideClick = () => {
        // The content is not immediately available, so we wait for the next render tick.
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80; // a little space from the top
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    };

    const generatePassword = useCallback(() => {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let charset = '';
        if (includeUppercase) charset += upper;
        if (includeLowercase) charset += lower;
        if (includeNumbers) charset += numbers;
        if (includeSymbols) charset += symbols;
        
        if (!charset) {
            toast({
                title: "Error",
                description: "Please select at least one character type.",
                variant: "destructive"
            });
            setPassword('');
            return;
        }

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(newPassword);
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, toast]);
    
    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const copyToClipboard = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            toast({
                title: "Copied!",
                description: "Password copied to clipboard.",
            });
        }
    };
    
    const strength = useMemo(() => {
        let score = 0;
        if (length >= 8) score++;
        if (length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }, [password, length]);

    const getStrengthLabel = () => {
        if (strength <= 2) return 'Weak';
        if (strength <= 4) return 'Moderate';
        return 'Strong';
    };

    const getStrengthColor = () => {
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };


    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                         <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <KeyRound className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Password Generator</CardTitle>
                        <CardDescription>Create strong and secure passwords.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative">
                            <Input
                                type="text"
                                value={password}
                                readOnly
                                placeholder="Your generated password"
                                className="pr-20 text-lg font-mono"
                            />
                             <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                                <Button variant="ghost" size="icon" onClick={generatePassword}>
                                    <RefreshCw className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                               <span className="font-medium">Strength:</span>
                               <span className={`font-semibold ${getStrengthColor().replace('bg-', 'text-')}`}>{getStrengthLabel()}</span>
                            </div>
                            <Progress value={(strength / 6) * 100} className={`h-2 [&>*]:${getStrengthColor()}`} />
                         </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                               <Label htmlFor="length">Password Length: <span className="font-bold">{length}</span></Label>
                            </div>
                            <Slider
                                id="length"
                                min={6}
                                max={32}
                                step={1}
                                value={[length]}
                                onValueChange={(value) => setLength(value[0])}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(Boolean(checked))} />
                                <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(checked) => setIncludeLowercase(Boolean(checked))} />
                                <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(Boolean(checked))} />
                                <Label htmlFor="numbers">Numbers (0-9)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(Boolean(checked))} />
                                <Label htmlFor="symbols">Symbols (!@#)</Label>
                            </div>
                        </div>
                        
                        <Button onClick={generatePassword} size="lg" className="w-full">
                            <RefreshCw className="mr-2 h-5 w-5" />
                            Generate New Password
                        </Button>
                    </CardContent>
                </Card>

                 {passwordGeneratorGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{passwordGeneratorGuide.title}</CardTitle>
                                        <CardDescription>{passwordGeneratorGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {passwordGeneratorGuide.steps.map((step, stepIndex) => (
                                                <li key={stepIndex}>{step}</li>
                                            ))}
                                        </ol>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )}
            </div>
        </div>
    );
}
