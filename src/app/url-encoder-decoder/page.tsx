"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, Link as LinkIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UrlEncoderPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const { toast } = useToast();

    const handleEncode = () => {
        try {
            const encoded = encodeURIComponent(input);
            setOutput(encoded);
        } catch (e) {
            toast({
                title: "Error",
                description: "Unable to encode URL.",
                variant: "destructive"
            });
        }
    };

    const handleDecode = () => {
        try {
            const decoded = decodeURIComponent(input);
            setOutput(decoded);
        } catch (e) {
            toast({
                title: "Error",
                description: "Invalid URL encoding.",
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
                        <LinkIcon className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">URL Encoder/Decoder</h1>
                    <p className="text-muted-foreground mt-2">
                        Encode or decode URLs safely for web use.
                    </p>
                </div>

                <Tabs defaultValue="encode" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="encode">Encode</TabsTrigger>
                        <TabsTrigger value="decode">Decode</TabsTrigger>
                    </TabsList>

                    <TabsContent value="encode">
                        <Card>
                            <CardHeader>
                                <CardTitle>URL to Encode</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="https://example.com/search?q=hello world"
                                    className="min-h-[150px]"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <Button className="mt-4 w-full" onClick={handleEncode}>
                                    Encode URL
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="decode">
                        <Card>
                            <CardHeader>
                                <CardTitle>URL to Decode</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
                                    className="min-h-[150px]"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <Button className="mt-4 w-full" onClick={handleDecode}>
                                    Decode URL
                                </Button>
                            </CardContent>
                        </Card>
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
