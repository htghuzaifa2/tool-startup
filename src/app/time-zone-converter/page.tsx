
"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Globe } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const timeZoneNames = Intl.supportedValuesOf('timeZone');

type SelectedZone = {
    id: number;
    timeZone: string;
};

export default function TimeZoneConverterPage() {
    const [selectedZones, setSelectedZones] = useState<SelectedZone[]>([
        { id: 1, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    ]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const timeZoneConverterGuide = guides.find(g => g.href.includes('time-zone-converter'));

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
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAddTimeZone = () => {
        const newZone: SelectedZone = {
            id: Date.now(),
            timeZone: 'UTC',
        };
        setSelectedZones([...selectedZones, newZone]);
    };
    
    const handleRemoveTimeZone = (id: number) => {
        setSelectedZones(selectedZones.filter(zone => zone.id !== id));
    };

    const handleTimeZoneChange = (id: number, newTimeZone: string) => {
        setSelectedZones(
            selectedZones.map(zone =>
                zone.id === id ? { ...zone, timeZone: newTimeZone } : zone
            )
        );
    };

    const getFormattedTime = (timeZone: string) => {
        return currentTime.toLocaleTimeString('en-US', {
            timeZone,
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };
    
     const getFormattedDate = (timeZone: string) => {
        return currentTime.toLocaleDateString('en-US', {
            timeZone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                 <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Globe className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Time Zone Converter</CardTitle>
                        <CardDescription>Compare the current time across different parts of the world.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            {selectedZones.map(zone => (
                                <Card key={zone.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex-1 w-full">
                                        <Select
                                            value={zone.timeZone}
                                            onValueChange={(newTimeZone) => handleTimeZoneChange(zone.id, newTimeZone)}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {timeZoneNames.map(tz => (
                                                    <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <p className="text-3xl font-bold font-mono">{getFormattedTime(zone.timeZone)}</p>
                                        <p className="text-sm text-muted-foreground">{getFormattedDate(zone.timeZone)}</p>
                                    </div>
                                     {selectedZones.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveTimeZone(zone.id)}>
                                            <Trash2 className="h-5 w-5 text-destructive" />
                                        </Button>
                                    )}
                                </Card>
                            ))}
                        </div>
                        <div className="text-center">
                            <Button onClick={handleAddTimeZone}>
                                <Plus className="mr-2 h-5 w-5" /> Add Time Zone
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                 {timeZoneConverterGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                           <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{timeZoneConverterGuide.title}</CardTitle>
                                        <CardDescription>{timeZoneConverterGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {timeZoneConverterGuide.steps.map((step, stepIndex) => (
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
