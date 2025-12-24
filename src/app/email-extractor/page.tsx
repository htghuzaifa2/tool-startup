"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Mail, RefreshCw } from 'lucide-react';

export default function EmailExtractor() {
    const [inputText, setInputText] = useState('');
    const [extractedEmails, setExtractedEmails] = useState('');
    const { toast } = useToast();

    const extractEmails = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = inputText.match(emailRegex);
        
        if (matches) {
            // Remove duplicates
            const uniqueEmails = Array.from(new Set(matches));
            setExtractedEmails(uniqueEmails.join('\n'));
            toast({
                title: "Extracted!",
                description: `Found ${uniqueEmails.length} unique email(s).`,
            });
        } else {
            setExtractedEmails('No emails found.');
        }
    };

    const copyToClipboard = () => {
        if (!extractedEmails || extractedEmails === 'No emails found.') return;
        navigator.clipboard.writeText(extractedEmails);
        toast({
            title: "Copied!",
            description: "Emails copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Email Extractor
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Extract all email addresses from pasted text easily.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-6 h-6 text-primary" />
                            Extractor
                        </CardTitle>
                        <CardDescription>Paste text containing emails below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="Contact us at support@example.com or sales@example.org"
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={extractEmails} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Extract Emails
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setExtractedEmails(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">Extracted Emails</Label>
                            <div className="relative">
                                <Textarea
                                    id="output"
                                    className="min-h-[150px]"
                                    value={extractedEmails}
                                    readOnly
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2 h-8"
                                    onClick={copyToClipboard}
                                    disabled={!extractedEmails || extractedEmails === 'No emails found.'}
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
