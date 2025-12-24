
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const adjectives = ['Cool', 'Super', 'Epic', 'Awesome', 'Happy', 'Silent', 'Swift', 'Red', 'Cosmic', 'Digital', 'Future', 'Cyber', 'Iron', 'Golden'];
const nouns = ['Panda', 'Coder', 'Hacker', 'Ninja', 'Rider', 'Pilot', 'Gamer', 'Jester', 'Wizard', 'King', 'Queen', 'Ghost', 'Lion', 'Tiger'];

export default function RandomUsernameGeneratorPage() {
    const [keyword, setKeyword] = useState('');
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeRandomWord, setIncludeRandomWord] = useState(true);
    const [usernames, setUsernames] = useState<string[]>([]);
    const { toast } = useToast();
    const usernameGeneratorGuide = guides.find(g => g.href.includes('random-username-generator'));

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

    const generateUsernames = () => {
        if (!keyword && !includeRandomWord) {
            toast({
                title: "Input Needed",
                description: "Please provide a keyword or enable random words.",
                variant: "destructive"
            });
            return;
        }

        const generated: string[] = [];
        const baseWord = keyword || nouns[Math.floor(Math.random() * nouns.length)];

        // Style 1: Keyword + Noun
        if (includeRandomWord) {
             generated.push(`${baseWord}${nouns[Math.floor(Math.random() * nouns.length)]}`);
        }
       
        // Style 2: Adjective + Keyword
        if(includeRandomWord) {
            generated.push(`${adjectives[Math.floor(Math.random() * adjectives.length)]}${baseWord}`);
        } else {
             generated.push(`${baseWord}`);
        }

        // Style 3 & 4: With numbers
        if (includeNumbers) {
            generated.push(`${baseWord}${Math.floor(Math.random() * 90) + 10}`);
            if (includeRandomWord) {
                 generated.push(`${adjectives[Math.floor(Math.random() * adjectives.length)]}${baseWord}${Math.floor(Math.random() * 99)}`);
            } else {
                generated.push(`${baseWord}_${Math.floor(Math.random() * 999)}`);
            }
        }
        
        // Style 5: With underscore
        if (includeRandomWord) {
            generated.push(`${baseWord}_${nouns[Math.floor(Math.random() * nouns.length)]}`);
        }

        // Ensure we have at least 5 unique suggestions if possible
        while (generated.length < 5) {
            const randomSuffix = Math.floor(Math.random() * 900) + 100;
            const newUsername = `${baseWord}${randomSuffix}`;
            if (!generated.includes(newUsername)) {
                generated.push(newUsername);
            }
        }

        setUsernames(Array.from(new Set(generated)).slice(0, 5)); // Remove duplicates and limit to 5
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `Username "${text}" copied to clipboard.`,
        });
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Users className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Random Username Generator</CardTitle>
                        <CardDescription>Generate creative usernames from keywords and random words.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="keyword">Enter a keyword (optional)</Label>
                            <Input
                                id="keyword"
                                placeholder="e.g., Star"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-around gap-4 p-4 bg-muted rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Switch id="include-numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                                <Label htmlFor="include-numbers">Include Numbers</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="include-random" checked={includeRandomWord} onCheckedChange={setIncludeRandomWord} />
                                <Label htmlFor="include-random">Include Random Word</Label>
                            </div>
                        </div>

                        <Button onClick={generateUsernames} size="lg" className="w-full">
                            <Sparkles className="mr-2" /> Generate Usernames
                        </Button>

                        {usernames.length > 0 && (
                            <Card className="bg-muted p-4">
                                <CardHeader className="p-0 pb-4">
                                    <CardTitle className="text-xl font-headline text-center">Suggestions</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-3">
                                        {usernames.map((name, index) => (
                                            <div key={index} className="flex items-center justify-between bg-background p-3 rounded-md shadow-sm">
                                                <p className="font-mono text-lg">{name}</p>
                                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(name)}>
                                                    <Copy className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                {usernameGeneratorGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{usernameGeneratorGuide.title}</CardTitle>
                                        <CardDescription>{usernameGeneratorGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {usernameGeneratorGuide.steps.map((step, stepIndex) => (
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
