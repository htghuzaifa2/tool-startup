"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, ArrowRightLeft, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Base64Page() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const { toast } = useToast();

    const handleEncode = () => {
        try {
            const encoded = btoa(input);
            setOutput(encoded);
        } catch (e) {
            toast({
                title: "Encoding Error",
                description: "Unable to encode text. Ensure it contains valid characters.",
                variant: "destructive"
            });
        }
    };

    const handleDecode = () => {
        try {
            const decoded = atob(input);
            setOutput(decoded);
        } catch (e) {
            toast({
                title: "Decoding Error",
                description: "Invalid Base64 string.",
                variant: "destructive"
            });
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast({
            title: "Copied!",
            description: "Result copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Base64 Encoder/Decoder</h1>
                    <p className="text-muted-foreground mt-2">
                        Easily encode text to Base64 or decode it back to plain text.
                    </p>
                </div>

                <Tabs defaultValue="encode" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="encode">Encode</TabsTrigger>
                        <TabsTrigger value="decode">Decode</TabsTrigger>
                    </TabsList>

                    <TabsContent value="encode">
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Text to Encode</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        placeholder="Enter plain text..."
                                        className="min-h-[150px]"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    <Button className="mt-4 w-full" onClick={handleEncode}>
                                        Encode to Base64
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="decode">
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Base64 to Decode</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        placeholder="Enter Base64 string..."
                                        className="min-h-[150px]"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    <Button className="mt-4 w-full" onClick={handleDecode}>
                                        Decode to Plain Text
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {output && (
                    <Card className="bg-muted/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Result</CardTitle>
                            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-background rounded-md border break-all font-mono text-sm">
                                {output}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
