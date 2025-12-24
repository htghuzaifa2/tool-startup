
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock, Key, Copy } from 'lucide-react';
import { z } from 'zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const formSchema = z.object({
  text: z.string().min(1, "Text to process cannot be empty."),
  shift: z.coerce.number().int().min(1, "Shift key must be at least 1.").max(25, "Shift key must be at most 25."),
});

export default function TextEncryptionPage() {
    const [inputText, setInputText] = useState('');
    const [shiftKey, setShiftKey] = useState('3');
    const [outputText, setOutputText] = useState('');
    const { toast } = useToast();
    const textEncryptionGuide = guides.find(g => g.href.includes('text-encryption'));

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

    const processText = (mode: 'encrypt' | 'decrypt') => {
        const validation = formSchema.safeParse({ text: inputText, shift: shiftKey });
        if (!validation.success) {
            toast({
                title: "Invalid Input",
                description: validation.error.errors[0].message,
                variant: "destructive",
            });
            return;
        }

        const { text, shift } = validation.data;
        const finalShift = mode === 'encrypt' ? shift : -shift;

        const result = text.split('').map(char => {
            const charCode = char.charCodeAt(0);

            // Uppercase letters
            if (charCode >= 65 && charCode <= 90) {
                return String.fromCharCode(((charCode - 65 + finalShift + 26) % 26) + 65);
            }
            // Lowercase letters
            else if (charCode >= 97 && charCode <= 122) {
                return String.fromCharCode(((charCode - 97 + finalShift + 26) % 26) + 97);
            }
            // Not a letter, return as is
            else {
                return char;
            }
        }).join('');

        setOutputText(result);
        toast({
            title: `Success!`,
            description: `Text has been ${mode}ed.`,
        });
    };

    const copyToClipboard = () => {
        if (!outputText) {
            toast({
                title: "Nothing to Copy",
                description: "There is no output text to copy.",
                variant: "destructive"
            });
            return;
        }
        navigator.clipboard.writeText(outputText);
        toast({
            title: "Copied!",
            description: "The output text has been copied to your clipboard.",
        });
    };


    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                         <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Lock className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Text Encryption Tool</CardTitle>
                        <CardDescription>Encrypt or decrypt text using a simple Caesar cipher.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                           <Label htmlFor="input-text">Input Text</Label>
                           <Textarea
                                id="input-text"
                                placeholder="Enter the text you want to process..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="min-h-[150px] font-mono"
                           />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="shift-key">Cipher Shift Key (1-25)</Label>
                           <div className="relative">
                               <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                               <Input
                                    id="shift-key"
                                    type="number"
                                    min="1"
                                    max="25"
                                    value={shiftKey}
                                    onChange={(e) => setShiftKey(e.target.value)}
                                    className="pl-10"
                                />
                           </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button onClick={() => processText('encrypt')} size="lg">
                                <Lock className="mr-2" /> Encrypt
                            </Button>
                            <Button onClick={() => processText('decrypt')} size="lg" variant="secondary">
                                <Unlock className="mr-2" /> Decrypt
                            </Button>
                        </div>
                        
                        {outputText && (
                            <div className="grid gap-2">
                                <Label htmlFor="output-text">Output Text</Label>
                                <div className="relative">
                                    <Textarea
                                        id="output-text"
                                        value={outputText}
                                        readOnly
                                        className="min-h-[150px] font-mono bg-muted"
                                    />
                                    <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={copyToClipboard}>
                                        <Copy className="h-5 w-5" />
                                    </Button>
                                </div>
                           </div>
                        )}
                    </CardContent>
                </Card>

                {textEncryptionGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{textEncryptionGuide.title}</CardTitle>
                                        <CardDescription>{textEncryptionGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {textEncryptionGuide.steps.map((step, stepIndex) => (
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
