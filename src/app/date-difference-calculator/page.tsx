
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


type Difference = {
    days: number;
    weeks: number;
    months: number;
};

export default function DateDifferenceCalculatorPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [difference, setDifference] = useState<Difference | null>(null);
    const [error, setError] = useState('');
    const dateDifferenceGuide = guides.find(g => g.href.includes('date-difference-calculator'));

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

    const calculateDifference = () => {
        setError('');
        if (!startDate || !endDate) {
            setError('Please select both a start and an end date.');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            setError('The end date must be after the start date.');
            setDifference(null);
            return;
        }
        
        const days = differenceInDays(end, start);
        const weeks = differenceInWeeks(end, start);
        const months = differenceInMonths(end, start);
        
        setDifference({ days, weeks, months });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold font-headline">Date Difference Calculator</CardTitle>
                        <CardDescription>Calculate the duration between two dates.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="font-medium">Start Date</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="font-medium">End Date</label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <Button onClick={calculateDifference} size="lg">Calculate Difference</Button>
                        </div>
                        
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {difference && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                <Card className="bg-muted">
                                    <CardHeader>
                                        <CardTitle className="text-4xl font-bold">{difference.months.toLocaleString()}</CardTitle>
                                        <p className="text-muted-foreground">Months</p>
                                    </CardHeader>
                                </Card>
                                <Card className="bg-muted">
                                    <CardHeader>
                                        <CardTitle className="text-4xl font-bold">{difference.weeks.toLocaleString()}</CardTitle>
                                        <p className="text-muted-foreground">Weeks</p>
                                    </CardHeader>
                                </Card>
                                <Card className="bg-muted">
                                    <CardHeader>
                                        <CardTitle className="text-4xl font-bold">{difference.days.toLocaleString()}</CardTitle>
                                        <p className="text-muted-foreground">Days</p>
                                    </CardHeader>
                                </Card>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {dateDifferenceGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{dateDifferenceGuide.title}</CardTitle>
                                        <CardDescription>{dateDifferenceGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {dateDifferenceGuide.steps.map((step, stepIndex) => (
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
