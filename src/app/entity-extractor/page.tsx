"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, ScanSearch, RefreshCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function EntityExtractor() {
    const [inputText, setInputText] = useState('');
    const [extractedData, setExtractedData] = useState('');
    const [extractEmails, setExtractEmails] = useState(true);
    const [extractPhones, setExtractPhones] = useState(true);
    const [extractUrls, setExtractUrls] = useState(true);
    const { toast } = useToast();

    const extractEntities = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text to extract from.",
                variant: "destructive"
            });
            return;
        }

        let results: string[] = [];

        if (extractEmails) {
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const emails = inputText.match(emailRegex) || [];
            if (emails.length > 0) {
                results.push("--- EMAILS ---");
                results.push(...emails);
                results.push("");
            }
        }

        if (extractUrls) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = inputText.match(urlRegex) || [];
            if (urls.length > 0) {
                results.push("--- URLs ---");
                results.push(...urls);
                results.push("");
            }
        }

        if (extractPhones) {
            // Simple phone regex, can be improved
            const phoneRegex = /(\+?[\d\s-]{7,})/g;
            // Filter out short matches that might not be phones
            const phones = (inputText.match(phoneRegex) || [])
                .map(p => p.trim())
                .filter(p => p.replace(/\D/g, '').length >= 7);
            
            if (phones.length > 0) {
                results.push("--- PHONE NUMBERS ---");
                results.push(...phones);
                results.push("");
            }
        }

        if (results.length === 0) {
            setExtractedData("No entities found.");
        } else {
            setExtractedData(results.join('\n'));
        }
    };

    const copyToClipboard = () => {
        if (!extractedData) return;
        navigator.clipboard.writeText(extractedData);
        toast({
            title: "Copied!",
            description: "Extracted data copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Entity Extractor
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Automatically detect emails, phones, and URLs from your text.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ScanSearch className="w-6 h-6 text-primary" />
                            Extractor
                        </CardTitle>
                        <CardDescription>Paste text and select what to extract.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Textarea
                                id="input-text"
                                placeholder="Contact us at support@example.com or visit https://example.com. Call +1-555-0123."
                                className="min-h-[150px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="emails" checked={extractEmails} onCheckedChange={(c) => setExtractEmails(!!c)} />
                                <Label htmlFor="emails">Emails</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="urls" checked={extractUrls} onCheckedChange={(c) => setExtractUrls(!!c)} />
                                <Label htmlFor="urls">URLs</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="phones" checked={extractPhones} onCheckedChange={(c) => setExtractPhones(!!c)} />
                                <Label htmlFor="phones">Phones</Label>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={extractEntities} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Extract
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setExtractedData(''); }}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="output">Extracted Entities</Label>
                            <div className="relative">
                                <Textarea
                                    id="output"
                                    className="min-h-[200px]"
                                    value={extractedData}
                                    readOnly
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2 h-8"
                                    onClick={copyToClipboard}
                                    disabled={!extractedData}
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
