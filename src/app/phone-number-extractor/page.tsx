"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Phone, RefreshCw } from 'lucide-react';

export default function PhoneNumberExtractor() {
    const [inputText, setInputText] = useState('');
    const [extractedPhones, setExtractedPhones] = useState('');
    const { toast } = useToast();

    const extractPhones = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        // Regex for various phone formats (International, US, etc.)
        // Matches: +1-555-555-5555, (555) 555-5555, 555-555-5555, etc.
        const phoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g;
        
        // Simpler regex to catch more general numbers that look like phones
        const simplePhoneRegex = /(\+?[\d\s-]{7,})/g;

        // Let's use a combination or the simple one with filtering
        const matches = inputText.match(simplePhoneRegex);
        
        if (matches) {
            // Filter: must have at least 7 digits
            const phones = matches
                .map(p => p.trim())
                .filter(p => p.replace(/\D/g, '').length >= 7 && p.replace(/\D/g, '').length <= 15);
            
            const uniquePhones = Array.from(new Set(phones));

            if (uniquePhones.length > 0) {
                setExtractedPhones(uniquePhones.join('\n'));
                toast({
                    title: "Extracted!",
                    description: `Found ${uniquePhones.length} phone number(s).`,
                });
            } else {
                 setExtractedPhones('No phone numbers found.');
            }
        } else {
            setExtractedPhones('No phone numbers found.');
        }
    };

    const copyToClipboard = () => {
        if (!extractedPhones || extractedPhones === 'No phone numbers found.') return;
        navigator.clipboard.writeText(extractedPhones);
        toast({
            title: "Copied!",
            description: "Phone numbers copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Phone Number Extractor
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Extract phone numbers from any block of text quickly.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="w-6 h-6 text-primary" />
                            Extractor
                        </CardTitle>
                        <CardDescription>Paste text containing phone numbers below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="Call me at +1 (555) 123-4567 or 555-0199."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={extractPhones} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Extract Numbers
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setExtractedPhones(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">Extracted Numbers</Label>
                            <div className="relative">
                                <Textarea
                                    id="output"
                                    className="min-h-[150px]"
                                    value={extractedPhones}
                                    readOnly
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2 h-8"
                                    onClick={copyToClipboard}
                                    disabled={!extractedPhones || extractedPhones === 'No phone numbers found.'}
                                >
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
