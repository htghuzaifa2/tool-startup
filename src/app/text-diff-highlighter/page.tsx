
"use client"

import { useState, useMemo, ReactNode } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { diffWords } from 'diff';
import { GitCompareArrows } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function TextDiffHighlighterPage() {
    const [originalText, setOriginalText] = useState('This is the original text.\nIt has two lines.');
    const [changedText, setChangedText] = useState('This is the updated text.\nIt has two lines and some changes.');
    const textDiffGuide = guides.find(g => g.href.includes('text-diff-highlighter'));

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

    const highlightedText = useMemo(() => {
        const differences = diffWords(originalText, changedText, { ignoreCase: true });
        return differences.map((part, index) => {
            const style: React.CSSProperties = {
                backgroundColor: part.added ? 'rgba(0, 255, 0, 0.2)' : part.removed ? 'rgba(255, 0, 0, 0.2)' : 'transparent',
                textDecoration: part.removed ? 'line-through' : 'none',
            };
            return <span key={index} style={style}>{part.value}</span>;
        });
    }, [originalText, changedText]);


    return (
        <div className="container mx-auto py-10">
            <div className="max-w-6xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <GitCompareArrows className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Text Difference Highlighter</CardTitle>
                        <CardDescription>Compare two blocks of text and see the differences highlighted below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="font-medium">Original Text</label>
                                <Textarea
                                    placeholder="Paste the first version of your text here."
                                    value={originalText}
                                    onChange={(e) => setOriginalText(e.target.value)}
                                    className="min-h-[250px] font-mono text-sm"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="font-medium">Changed Text</label>
                                <Textarea
                                    placeholder="Paste the second version of your text here."
                                    value={changedText}
                                    onChange={(e) => setChangedText(e.target.value)}
                                    className="min-h-[250px] font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-medium text-center block">Highlighted Differences</label>
                            <Card className="min-h-[250px] bg-muted">
                                <CardContent className="p-4">
                                     <pre className="whitespace-pre-wrap font-mono text-sm">
                                        <code>{highlightedText}</code>
                                    </pre>
                                </CardContent>
                            </Card>
                             <div className="flex justify-center items-center gap-6 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-sm bg-green-500/20"></span>
                                    <span>Added</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-sm bg-red-500/20"></span>
                                    <span>Removed</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {textDiffGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{textDiffGuide.title}</CardTitle>
                                        <CardDescription>{textDiffGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {textDiffGuide.steps.map((step, stepIndex) => (
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
