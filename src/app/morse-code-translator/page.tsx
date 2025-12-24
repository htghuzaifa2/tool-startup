
"use client"

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Volume2, ArrowRightLeft, Languages, Copy, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const MORSE_CODE_MAP: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ' ': '/', ',': '--..--', '.': '.-.-.-', '?': '..--..', ';': '-.-.-.', ':': '---...',
    '\'': '.----.', '-': '-....-', '(': '-.--.', ')': '-.--.-', '_': '..--.-', '"': '.-..-.',
    '$': '...-..-', '!': '-.-.--', '@': '.--.-.', '=': '-...-', '+': '.-.-.'
};

const REVERSE_MORSE_CODE_MAP: { [key: string]: string } = Object.entries(MORSE_CODE_MAP)
    .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

export default function MorseCodeTranslatorPage() {
    const [textInput, setTextInput] = useState('Hello World');
    const [morseInput, setMorseInput] = useState('');
    const [lastChanged, setLastChanged] = useState<'text' | 'morse'>('text');
    const [isPlaying, setIsPlaying] = useState(false);
    const { toast } = useToast();
    const morseCodeGuide = guides.find(g => g.href.includes('morse-code-translator'));
    
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
        if (lastChanged === 'text') {
            const morse = textInput.toUpperCase().split('').map(char => MORSE_CODE_MAP[char] || '').join(' ');
            setMorseInput(morse);
        }
    }, [textInput, lastChanged]);

    useEffect(() => {
        if (lastChanged === 'morse') {
            const text = morseInput.split(' ').map(code => REVERSE_MORSE_CODE_MAP[code] || '').join('');
            setTextInput(text);
        }
    }, [morseInput, lastChanged]);
    
    const playMorseSound = async () => {
        if (!morseInput || isPlaying) return;

        let audioContext: AudioContext;
        try {
             audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            toast({ title: "Audio Error", description: "Your browser does not support the Web Audio API.", variant: "destructive"});
            return;
        }

        setIsPlaying(true);

        const dotDuration = 80;
        const dashDuration = dotDuration * 3;
        const symbolSpace = dotDuration;
        const letterSpace = dotDuration * 3;
        const wordSpace = dotDuration * 7;
        let currentTime = audioContext.currentTime;

        const playTone = (duration: number, time: number) => {
            if (!audioContext) return;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 600;
            gainNode.gain.setValueAtTime(0, time);
            gainNode.gain.linearRampToValueAtTime(0.5, time + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, time + duration / 1000);
            oscillator.start(time);
            oscillator.stop(time + duration / 1000);
        };

        for (const char of morseInput) {
            switch (char) {
                case '.':
                    playTone(dotDuration, currentTime);
                    currentTime += (dotDuration + symbolSpace) / 1000;
                    break;
                case '-':
                    playTone(dashDuration, currentTime);
                    currentTime += (dashDuration + symbolSpace) / 1000;
                    break;
                case ' ':
                    currentTime += (letterSpace - symbolSpace) / 1000;
                    break;
                case '/':
                    currentTime += (wordSpace - letterSpace) / 1000;
                    break;
            }
        }
        setTimeout(() => setIsPlaying(false), (currentTime - audioContext.currentTime) * 1000);
    };

    const handleSwap = () => {
        const tempText = textInput;
        const tempMorse = morseInput;
        setTextInput(tempMorse);
        setMorseInput(tempText);
    };
    
    const copyToClipboard = (text: string, type: string) => {
        if(!text) return;
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: `${type} copied to clipboard.` });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Languages className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Morse Code Translator</CardTitle>
                        <CardDescription>Translate text to Morse code and back, with sound playback.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="text-input">Text</Label>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(textInput, 'Text')}>
                                        <Copy className="h-4 w-4"/>
                                    </Button>
                                </div>
                                <Textarea
                                    id="text-input"
                                    placeholder="Enter text..."
                                    value={textInput}
                                    onChange={(e) => { setTextInput(e.target.value); setLastChanged('text'); }}
                                    className="min-h-[200px]"
                                />
                            </div>

                             <div className="my-auto">
                                <Button variant="outline" size="icon" onClick={handleSwap}>
                                    <ArrowRightLeft className="h-4 w-4" />
                                </Button>
                            </div>

                             <div className="space-y-2">
                                 <div className="flex justify-between items-center">
                                    <Label htmlFor="morse-input">Morse Code</Label>
                                    <div className="flex items-center">
                                        <Button variant="ghost" size="icon" onClick={playMorseSound} disabled={isPlaying || !morseInput}>
                                            {isPlaying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4"/>}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(morseInput, 'Morse Code')}>
                                            <Copy className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                                <Textarea
                                    id="morse-input"
                                    placeholder="Enter morse code..."
                                    value={morseInput}
                                    onChange={(e) => { setMorseInput(e.target.value.replace(/[^.\- /]/g, '')); setLastChanged('morse'); }}
                                    className="min-h-[200px] font-mono"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {morseCodeGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{morseCodeGuide.title}</CardTitle>
                                        <CardDescription>{morseCodeGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {morseCodeGuide.steps.map((step, stepIndex) => (
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
