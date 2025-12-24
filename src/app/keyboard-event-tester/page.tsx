
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


interface KeyEventInfo {
    key: string;
    code: string;
    which: number;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

export default function KeyboardEventTesterPage() {
    const [keyInfo, setKeyInfo] = useState<KeyEventInfo | null>(null);
    const keyboardEventGuide = guides.find(g => g.href.includes('keyboard-event-tester'));

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
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default browser actions for certain keys like spacebar scrolling
            if (e.code === 'Space' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
            }
            setKeyInfo({
                key: e.key,
                code: e.code,
                which: e.which,
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey,
            });
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Keyboard className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Keyboard Event Tester</CardTitle>
                        <CardDescription>Press any key to see its details and JavaScript event properties.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div 
                            className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg text-4xl md:text-6xl font-mono text-muted-foreground p-4"
                        >
                            {keyInfo ? keyInfo.key : "Press any key"}
                        </div>

                        {keyInfo ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-3xl md:text-5xl font-bold font-mono text-center truncate">{keyInfo.key === ' ' ? '" "' : keyInfo.key}</CardTitle>
                                            <CardDescription className="text-center">event.key</CardDescription>
                                        </CardHeader>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-3xl md:text-5xl font-bold font-mono text-center truncate">{keyInfo.code}</CardTitle>
                                            <CardDescription className="text-center">event.code</CardDescription>
                                        </CardHeader>
                                    </Card>
                                     <Card>
                                        <CardHeader>
                                            <CardTitle className="text-3xl md:text-5xl font-bold font-mono text-center">{keyInfo.which}</CardTitle>
                                            <CardDescription className="text-center">event.which</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-xl">Modifier Keys</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                            <div className={`p-4 rounded-md font-semibold ${keyInfo.shiftKey ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Shift</div>
                                            <div className={`p-4 rounded-md font-semibold ${keyInfo.ctrlKey ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Control</div>
                                            <div className={`p-4 rounded-md font-semibold ${keyInfo.altKey ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Alt</div>
                                            <div className={`p-4 rounded-md font-semibold ${keyInfo.metaKey ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Meta</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">Waiting for a key press...</p>
                        )}
                    </CardContent>
                </Card>

                {keyboardEventGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{keyboardEventGuide.title}</CardTitle>
                                        <CardDescription>{keyboardEventGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {keyboardEventGuide.steps.map((step, stepIndex) => (
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
