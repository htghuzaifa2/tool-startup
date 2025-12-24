
"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { ListChecks, Play, Copy } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function RandomItemPickerPage() {
    const [optionsText, setOptionsText] = useState('Apple\nBanana\nOrange\nGrape\nStrawberry\nMango');
    const [options, setOptions] = useState<string[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const { toast } = useToast();
    const pickerGuide = guides.find(g => g.href.includes('random-item-picker'));

    const handleGuideClick = () => {
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80;
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    };

    useEffect(() => {
        const parsedOptions = optionsText.split('\n').map(o => o.trim()).filter(Boolean);
        setOptions(parsedOptions);
        setWinner(null);
    }, [optionsText]);

    const handlePick = () => {
        if (options.length < 2) {
            toast({
                title: 'Not Enough Options',
                description: 'Please provide at least two options to pick from.',
                variant: 'destructive',
            });
            return;
        }

        setIsSpinning(true);
        setWinner(null);
        setHighlightedIndex(0);

        const spinDuration = 3000;
        const intervalTime = 75;
        const totalSpins = spinDuration / intervalTime;
        let spinCount = 0;

        const spinInterval = setInterval(() => {
            spinCount++;
            setHighlightedIndex(prev => (prev! + 1) % options.length);

            if (spinCount >= totalSpins) {
                clearInterval(spinInterval);
                const winnerIndex = Math.floor(Math.random() * options.length);
                setHighlightedIndex(winnerIndex);
                setWinner(options[winnerIndex]);
                setIsSpinning(false);
            }
        }, intervalTime);
    };

    const copyToClipboard = () => {
        if (!winner) return;
        navigator.clipboard.writeText(winner);
        toast({
            title: "Copied!",
            description: `Winner "${winner}" copied to clipboard.`,
        });
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <ListChecks className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Random Item Picker</CardTitle>
                        <CardDescription>Enter a list of items and let the tool randomly pick one for you!</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <Label htmlFor="options-input">Enter items (one per line)</Label>
                            <Textarea
                                id="options-input"
                                placeholder="Item 1\nItem 2\nItem 3"
                                value={optionsText}
                                onChange={(e) => setOptionsText(e.target.value)}
                                className="min-h-[250px] font-mono"
                                disabled={isSpinning}
                            />
                             <Button onClick={handlePick} disabled={isSpinning || options.length < 2} className="w-full" size="lg">
                                <Play className="mr-2" /> {isSpinning ? 'Picking...' : 'Pick a Random Item'}
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <Card className="min-h-[300px] bg-muted overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="text-center font-headline">The List</CardTitle>
                                </CardHeader>
                                <CardContent className="relative flex items-center justify-center h-full">
                                    <div className="space-y-2 w-full max-h-60 overflow-y-auto p-2">
                                        {options.map((option, index) => (
                                            <div 
                                                key={index}
                                                className={`p-3 text-center rounded-md transition-all duration-100 ${highlightedIndex === index ? 'bg-primary text-primary-foreground scale-105 shadow-lg' : 'bg-background'}`}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {winner && (
                                <Card className="border-green-500 bg-green-500/10 text-center">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-headline text-green-700 dark:text-green-300">Winner!</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">{winner}</p>
                                        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="mt-4 mx-auto">
                                            <Copy className="mr-2 h-4 w-4" /> Copy Winner
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {pickerGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{pickerGuide.title}</CardTitle>
                                        <CardDescription>{pickerGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {pickerGuide.steps.map((step, stepIndex) => (
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
