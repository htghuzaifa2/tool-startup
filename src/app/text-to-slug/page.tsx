"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Link as LinkIcon, RefreshCw } from 'lucide-react';

export default function TextToSlug() {
    const [inputText, setInputText] = useState('');
    const [slug, setSlug] = useState('');
    const { toast } = useToast();

    const generateSlug = () => {
        if (!inputText.trim()) {
            setSlug('');
            return;
        }

        const newSlug = inputText
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
            .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and hyphens with a single hyphen
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

        setSlug(newSlug);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        // Live update
        const text = e.target.value;
        const newSlug = text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setSlug(newSlug);
    };

    const copyToClipboard = () => {
        if (!slug) return;
        navigator.clipboard.writeText(slug);
        toast({
            title: "Copied!",
            description: "Slug copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Text to Slug Converter
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Convert your titles or strings into SEO-friendly slugs.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="w-6 h-6 text-primary" />
                            Slug Generator
                        </CardTitle>
                        <CardDescription>Enter text below to instantly generate a slug.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Input
                                id="input-text"
                                placeholder="Hello World! This is a Title."
                                value={inputText}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug-output">Generated Slug</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="slug-output"
                                    value={slug}
                                    readOnly
                                    className="font-mono bg-muted"
                                />
                                <Button onClick={copyToClipboard} disabled={!slug}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
