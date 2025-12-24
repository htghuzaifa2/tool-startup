
"use client"

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft, Scroll } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const toRoman: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
];

const fromRoman: { [key: string]: number } = {
    M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1
};

export default function RomanNumeralConverterPage() {
    const [numberInput, setNumberInput] = useState('1994');
    const [romanInput, setRomanInput] = useState('MCMXCIV');
    const [lastChanged, setLastChanged] = useState<'number' | 'roman'>('number');
    const [error, setError] = useState('');
    const romanNumeralGuide = guides.find(g => g.href.includes('roman-numeral-converter'));

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

    useEffect(() => {
        setError('');
        if (lastChanged === 'number') {
            const num = parseInt(numberInput, 10);
            if (isNaN(num) || num <= 0 || num > 3999) {
                if(numberInput) setError('Please enter a number between 1 and 3999.');
                setRomanInput('');
                return;
            }
            
            let result = '';
            let currentNum = num;
            for (const [value, symbol] of toRoman) {
                while (currentNum >= value) {
                    result += symbol;
                    currentNum -= value;
                }
            }
            setRomanInput(result);
        } else { // lastChanged === 'roman'
            const roman = romanInput.toUpperCase();
            if (!/^[MDCLXVI]*$/.test(roman)) {
                 if(romanInput) setError('Invalid Roman numeral characters.');
                setNumberInput('');
                return;
            }
            if (!romanInput) {
                setNumberInput('');
                return;
            }

            let result = 0;
            for (let i = 0; i < roman.length; i++) {
                const currentVal = fromRoman[roman[i]];
                const nextVal = fromRoman[i + 1];
                if (nextVal > currentVal) {
                    result += nextVal - currentVal;
                    i++;
                } else {
                    result += currentVal;
                }
            }
            if(result > 3999) {
                setError('Numbers above 3999 are not supported.');
                setNumberInput('');
            } else {
                setNumberInput(result.toString());
            }
        }
    }, [numberInput, romanInput, lastChanged]);
    
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumberInput(e.target.value.replace(/[^0-9]/g, ''));
        setLastChanged('number');
    };

    const handleRomanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRomanInput(e.target.value.toUpperCase());
        setLastChanged('roman');
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Scroll className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Roman Numeral Converter</CardTitle>
                        <CardDescription>Convert numbers to Roman numerals and back.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                         {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="w-full space-y-2">
                                <Label htmlFor="number" className="font-medium">Number</Label>
                                <Input 
                                    id="number" 
                                    type="text"
                                    value={numberInput}
                                    onChange={handleNumberChange}
                                    className="text-lg font-mono"
                                    maxLength={4}
                                />
                            </div>
                            
                            <div className="pt-8">
                                <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                            </div>

                            <div className="w-full space-y-2">
                                <Label htmlFor="roman" className="font-medium">Roman Numeral</Label>
                                <Input 
                                    id="roman" 
                                    type="text"
                                    value={romanInput}
                                    onChange={handleRomanChange}
                                    className="text-lg font-mono"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {romanNumeralGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{romanNumeralGuide.title}</CardTitle>
                                        <CardDescription>{romanNumeralGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {romanNumeralGuide.steps.map((step, stepIndex) => (
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
