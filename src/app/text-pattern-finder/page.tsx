
"use client"

import { useState, useMemo, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileSearch, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function TextPatternFinderPage() {
    const [pattern, setPattern] = useState('\\b\\w{4}\\b'); // Default to find 4-letter words
    const [flags, setFlags] = useState('gi'); // Default to global, case-insensitive
    const [text, setText] = useState('This is a sample text for testing regular expressions. Find all words that are exactly four letters long.');
    const [error, setError] = useState<string | null>(null);
    const textPatternGuide = guides.find(g => g.href.includes('text-pattern-finder'));

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

    const highlightedText = useMemo<ReactNode[] | null>(() => {
        if (!pattern) {
            setError(null);
            return [<span key="full-text">{text}</span>];
        }

        try {
            const regex = new RegExp(pattern, flags);
            setError(null);

            if (!flags.includes('g')) {
                 const match = text.match(regex);
                 if (!match) return [<span key="full-text">{text}</span>];
                 
                 const index = match.index || 0;
                 return [
                    <span key="start">{text.substring(0, index)}</span>,
                    <span key="match" className="bg-primary/20 text-primary-foreground rounded px-1">{match[0]}</span>,
                    <span key="end">{text.substring(index + match[0].length)}</span>
                 ];
            }

            const parts: ReactNode[] = [];
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    parts.push(
                        <span key={`text-${lastIndex}`}>
                            {text.substring(lastIndex, match.index)}
                        </span>
                    );
                }
                parts.push(
                    <span key={`match-${match.index}`} className="bg-primary/20 text-primary-foreground rounded px-1">
                        {match[0]}
                    </span>
                );
                lastIndex = regex.lastIndex;
                 if (!regex.global) break; // Prevent infinite loops
            }

            if (lastIndex < text.length) {
                parts.push(
                    <span key={`text-${lastIndex}`}>
                        {text.substring(lastIndex)}
                    </span>
                );
            }

            return parts;

        } catch (e: any) {
            setError(e.message);
            return [<span key="full-text">{text}</span>];
        }
    }, [pattern, flags, text]);

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <FileSearch className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Text Pattern Finder (Regex)</CardTitle>
                        <CardDescription>Search and highlight specific patterns or words using regular expressions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pattern">Regular Expression Pattern</Label>
                                <Input
                                    id="pattern"
                                    value={pattern}
                                    onChange={(e) => setPattern(e.target.value)}
                                    placeholder="e.g., \\d+"
                                    className="font-mono"
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="flags">Flags</Label>
                                <Input
                                    id="flags"
                                    value={flags}
                                    onChange={(e) => setFlags(e.target.value.replace(/[^gimuy]/g, ''))}
                                    placeholder="e.g., gi"
                                    className="font-mono w-24"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="text-input">Your Text</Label>
                            <Textarea
                                id="text-input"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="min-h-[200px] font-mono"
                                placeholder="Paste the text you want to search here..."
                            />
                        </div>

                        <div className="space-y-2">
                             <Label>Result</Label>
                             <Card className="min-h-[200px] bg-muted">
                                <CardContent className="p-4">
                                     <pre className="whitespace-pre-wrap font-mono text-sm">
                                        <code>{highlightedText}</code>
                                    </pre>
                                </CardContent>
                            </Card>
                        </div>

                         {error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Invalid Regular Expression</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {textPatternGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick}>
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{textPatternGuide.title}</CardTitle>
                                        <CardDescription>{textPatternGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {textPatternGuide.steps.map((step, stepIndex) => (
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
