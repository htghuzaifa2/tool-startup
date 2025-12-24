"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import { Copy, Code, RefreshCw } from 'lucide-react';

export default function RegexTester() {
    const [regexPattern, setRegexPattern] = useState('');
    const [testString, setTestString] = useState('');
    const [matches, setMatches] = useState<string[]>([]);
    const [flags, setFlags] = useState({
        global: true,
        ignoreCase: false,
        multiline: false,
    });
    const { toast } = useToast();

    useEffect(() => {
        testRegex();
    }, [regexPattern, testString, flags]);

    const testRegex = () => {
        if (!regexPattern || !testString) {
            setMatches([]);
            return;
        }

        try {
            const flagString = `${flags.global ? 'g' : ''}${flags.ignoreCase ? 'i' : ''}${flags.multiline ? 'm' : ''}`;
            const regex = new RegExp(regexPattern, flagString);
            
            const foundMatches = testString.match(regex);
            setMatches(foundMatches || []);
        } catch (error) {
            // Invalid regex, just clear matches
            setMatches([]);
        }
    };

    const copyToClipboard = () => {
        if (matches.length === 0) return;
        navigator.clipboard.writeText(JSON.stringify(matches, null, 2));
        toast({
            title: "Copied!",
            description: "Matches copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Code className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Regex Tester</CardTitle>
                        <CardDescription>Test and validate Regular Expressions online with real-time matching.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="pattern">Regular Expression Pattern</Label>
                            <Input
                                id="pattern"
                                placeholder="e.g. [a-zA-Z]+"
                                value={regexPattern}
                                onChange={(e) => setRegexPattern(e.target.value)}
                            />
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="global" 
                                    checked={flags.global} 
                                    onCheckedChange={(c) => setFlags(prev => ({ ...prev, global: c === true }))} 
                                />
                                <label htmlFor="global" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Global (g)
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="ignoreCase" 
                                    checked={flags.ignoreCase} 
                                    onCheckedChange={(c) => setFlags(prev => ({ ...prev, ignoreCase: c === true }))} 
                                />
                                <label htmlFor="ignoreCase" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Ignore Case (i)
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="multiline" 
                                    checked={flags.multiline} 
                                    onCheckedChange={(c) => setFlags(prev => ({ ...prev, multiline: c === true }))} 
                                />
                                <label htmlFor="multiline" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Multiline (m)
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="test-string">Test String</Label>
                            <Textarea
                                id="test-string"
                                placeholder="Enter text to test against the regex..."
                                className="min-h-[150px]"
                                value={testString}
                                onChange={(e) => setTestString(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Matches ({matches ? matches.length : 0})</Label>
                                <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={matches.length === 0}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Matches
                                </Button>
                            </div>
                            <div className="bg-muted p-4 rounded-md min-h-[100px] whitespace-pre-wrap font-mono text-sm">
                                {matches.length > 0 ? (
                                    <ul className="list-disc pl-4 space-y-1">
                                        {matches.map((match, index) => (
                                            <li key={index}>{match}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-muted-foreground">No matches found or invalid regex.</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How to Use</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Enter your regular expression pattern in the "Pattern" field (without the slashes).</li>
                            <li>Select flags like Global (g), Ignore Case (i), or Multiline (m).</li>
                            <li>Type or paste your text in the "Test String" area.</li>
                            <li>Matches will appear instantly in the results box below.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
