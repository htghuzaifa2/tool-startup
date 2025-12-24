
"use client"

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Binary } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


type Base = '2' | '8' | '10' | '16';
const baseOptions: { value: Base; label: string }[] = [
    { value: '2', label: 'Binary' },
    { value: '8', label: 'Octal' },
    { value: '10', label: 'Decimal' },
    { value: '16', label: 'Hexadecimal' },
];

const baseValidationRegex: Record<Base, RegExp> = {
    '2': /^[01]*$/,
    '8': /^[0-7]*$/,
    '10': /^[0-9]*$/,
    '16': /^[0-9a-fA-F]*$/,
};

function bigIntToString(value: bigint, base: number) {
    if (base < 2 || base > 36) {
        throw new Error("Base must be between 2 and 36");
    }
    if (value === 0n) return '0';

    let result = '';
    let isNegative = value < 0n;
    if (isNegative) {
        value = -value;
    }

    while (value > 0n) {
        const remainder = value % BigInt(base);
        result = '0123456789abcdefghijklmnopqrstuvwxyz'[Number(remainder)] + result;
        value = value / BigInt(base);
    }
    
    return isNegative ? '-' + result : result;
}

export default function BaseConverterPage() {
    const [inputValue, setInputValue] = useState("1010");
    const [fromBase, setFromBase] = useState<Base>('2');
    const [toBase, setToBase] = useState<Base>('10');
    const [result, setResult] = useState("");
    const { toast } = useToast();
    const baseConverterGuide = guides.find(g => g.href.includes('base-converter'));

    const handleGuideClick = () => {
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80;
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    };

    useEffect(() => {
        if (!inputValue.trim()) {
            setResult("");
            return;
        }
        
        if (!baseValidationRegex[fromBase].test(inputValue)) {
            setResult("Invalid input for this base");
            return;
        }

        try {
            const decimalValue = BigInt('0' + (fromBase === '2' ? 'b' : fromBase === '8' ? 'o' : fromBase === '16' ? 'x' : '') + inputValue);
            const convertedValue = bigIntToString(decimalValue, parseInt(toBase)).toUpperCase();
            setResult(convertedValue);
        } catch (error) {
            console.error("Conversion error:", error);
            setResult("Conversion error");
            toast({
                title: "Error",
                description: "An error occurred during conversion. The number might be too large.",
                variant: "destructive",
            });
        }
    }, [inputValue, fromBase, toBase, toast]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        if (value === '' || baseValidationRegex[fromBase].test(value)) {
            setInputValue(value);
        }
    };
    
    const handleSwapBases = () => {
        if (result && !result.includes("Invalid") && !result.includes("error")) {
            const oldFrom = fromBase;
            setFromBase(toBase);
            setToBase(oldFrom);
            setInputValue(result.toLowerCase());
        } else {
            toast({
                title: "Swap Failed",
                description: "Cannot swap with an invalid or empty result.",
                variant: "destructive"
            });
        }
    };

    const handleFromBaseChange = (v: string) => {
      setFromBase(v as Base);
      if (!baseValidationRegex[v as Base].test(inputValue)) {
        setInputValue('');
      }
    }

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                         <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Binary className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Base Converter</CardTitle>
                        <CardDescription>Convert numbers between binary, octal, decimal, and hexadecimal.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2">
                            <div className="w-full space-y-2">
                                <label className="text-sm font-medium">From</label>
                                <Input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="text-lg font-mono"
                                />
                                <Select value={fromBase} onValueChange={handleFromBaseChange}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {baseOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:pt-8">
                                <Button variant="ghost" size="icon" onClick={handleSwapBases}>
                                    <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                                </Button>
                            </div>

                            <div className="w-full space-y-2">
                                <label className="text-sm font-medium">To</label>
                                <Input type="text" value={result} readOnly className="text-lg font-bold bg-muted font-mono" />
                                <Select value={toBase} onValueChange={(v) => setToBase(v as Base)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {baseOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {baseConverterGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{baseConverterGuide.title}</CardTitle>
                                        <CardDescription>{baseConverterGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {baseConverterGuide.steps.map((step, stepIndex) => (
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
