
"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Loader2, AlertTriangle, Globe } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function IpAddressFinderPage() {
    const [ipData, setIpData] = useState<{ ip: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const ipFinderGuide = guides.find(g => g.href.includes('ip-address-finder'));

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

    const fetchIpAddress = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Using a free, public API to get the IP address
            const response = await fetch('https://api.ipify.org?format=json');
            if (!response.ok) {
                throw new Error('Failed to fetch IP address. The service may be down.');
            }
            const data = await response.json();
            setIpData(data);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            setIpData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIpAddress();
    }, [fetchIpAddress]);

    const copyToClipboard = () => {
        if (ipData?.ip) {
            navigator.clipboard.writeText(ipData.ip);
            toast({
                title: "Copied!",
                description: "Your IP address has been copied to the clipboard.",
            });
        }
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-md mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Globe className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">IP Address Finder</CardTitle>
                        <CardDescription>View your public IP address as seen by other servers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Card className="h-24 flex items-center justify-center bg-muted">
                            {isLoading && (
                                <div className="flex items-center text-muted-foreground">
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                    <span>Fetching your IP...</span>
                                </div>
                            )}
                            {error && (
                                <div className="flex items-center text-destructive">
                                    <AlertTriangle className="mr-2 h-6 w-6" />
                                    <span>{error}</span>
                                </div>
                            )}
                            {ipData && (
                                <p className="text-3xl font-mono font-bold">{ipData.ip}</p>
                            )}
                        </Card>
                        
                        <div className="flex justify-center gap-4">
                            <Button onClick={copyToClipboard} disabled={!ipData || isLoading}>
                                <Copy className="mr-2 h-5 w-5" /> Copy IP
                            </Button>
                            <Button onClick={fetchIpAddress} variant="outline" disabled={isLoading}>
                                <RefreshCw className="mr-2 h-5 w-5" /> Refresh
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                 {ipFinderGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{ipFinderGuide.title}</CardTitle>
                                        <CardDescription>{ipFinderGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {ipFinderGuide.steps.map((step, stepIndex) => (
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
