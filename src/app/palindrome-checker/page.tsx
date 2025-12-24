"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Repeat } from 'lucide-react';

export default function PalindromeChecker() {
    const [inputText, setInputText] = useState('');
    const [isPalindrome, setIsPalindrome] = useState<boolean | null>(null);
    const { toast } = useToast();

    const checkPalindrome = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text.",
                variant: "destructive"
            });
            return;
        }

        // Remove non-alphanumeric chars and convert to lower case
        const cleanText = inputText.toLowerCase().replace(/[^a-z0-9]/g, '');
        const reversedText = cleanText.split('').reverse().join('');
        
        setIsPalindrome(cleanText === reversedText);
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Palindrome Checker
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Test whether your sentence is a palindrome (ignores spaces & punctuation).
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Repeat className="w-6 h-6 text-primary" />
                            Checker
                        </CardTitle>
                        <CardDescription>Enter text to check if it's a palindrome.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Input Text</Label>
                            <Input
                                id="input-text"
                                placeholder="Madam, I'm Adam"
                                value={inputText}
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                    setIsPalindrome(null); // Reset result on change
                                }}
                            />
                        </div>

                        <Button onClick={checkPalindrome} className="w-full">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Check
                        </Button>

                        {isPalindrome !== null && (
                            <div className={`p-4 rounded-lg text-center font-bold text-lg ${isPalindrome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {isPalindrome ? "Yes! It is a palindrome." : "No, it is not a palindrome."}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
