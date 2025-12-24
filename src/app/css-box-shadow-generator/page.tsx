
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Copy, Code, Layers } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const hexToRgba = (hex: string, opacity: number): string => {
    let r = 0, g = 0, b = 0;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        let c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        const numeric = c.map(i => parseInt(i, 16));
        r = numeric[0] * 16 + numeric[1];
        g = numeric[2] * 16 + numeric[3];
        b = numeric[4] * 16 + numeric[5];
    } else {
      return `rgba(0, 0, 0, ${opacity})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};


export default function BoxShadowGeneratorPage() {
    const [horizontalOffset, setHorizontalOffset] = useState(10);
    const [verticalOffset, setVerticalOffset] = useState(10);
    const [blurRadius, setBlurRadius] = useState(5);
    const [spreadRadius, setSpreadRadius] = useState(0);
    const [shadowColor, setShadowColor] = useState('#000000');
    const [shadowOpacity, setShadowOpacity] = useState(0.75);
    const [isInset, setIsInset] = useState(false);
    const { toast } = useToast();
    const boxShadowGuide = guides.find(g => g.href.includes('css-box-shadow-generator'));

    const handleGuideClick = () => {
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80;
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    };

    const boxShadowStyle = `${isInset ? 'inset ' : ''}${horizontalOffset}px ${verticalOffset}px ${blurRadius}px ${spreadRadius}px ${hexToRgba(shadowColor, shadowOpacity)}`;

    const copyToClipboard = () => {
        const codeToCopy = `box-shadow: ${boxShadowStyle};`;
        navigator.clipboard.writeText(codeToCopy);
        toast({
            title: "Copied!",
            description: "CSS box-shadow code copied to clipboard.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Layers className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">CSS Box Shadow Generator</CardTitle>
                        <CardDescription>Visually design CSS box shadows and copy the generated code instantly.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6 p-4 border rounded-lg">
                            <div className="space-y-4">
                                <Label htmlFor="h-offset">Horizontal Offset: <span className="font-bold">{horizontalOffset}px</span></Label>
                                <Slider id="h-offset" min={-50} max={50} value={[horizontalOffset]} onValueChange={(v) => setHorizontalOffset(v[0])} />
                            </div>
                            <div className="space-y-4">
                                <Label htmlFor="v-offset">Vertical Offset: <span className="font-bold">{verticalOffset}px</span></Label>
                                <Slider id="v-offset" min={-50} max={50} value={[verticalOffset]} onValueChange={(v) => setVerticalOffset(v[0])} />
                            </div>
                            <div className="space-y-4">
                                <Label htmlFor="blur">Blur Radius: <span className="font-bold">{blurRadius}px</span></Label>
                                <Slider id="blur" min={0} max={100} value={[blurRadius]} onValueChange={(v) => setBlurRadius(v[0])} />
                            </div>
                            <div className="space-y-4">
                                <Label htmlFor="spread">Spread Radius: <span className="font-bold">{spreadRadius}px</span></Label>
                                <Slider id="spread" min={-50} max={50} value={[spreadRadius]} onValueChange={(v) => setSpreadRadius(v[0])} />
                            </div>
                            <div className="space-y-4">
                                <Label htmlFor="opacity">Shadow Opacity: <span className="font-bold">{shadowOpacity.toFixed(2)}</span></Label>
                                <Slider id="opacity" min={0} max={1} step={0.01} value={[shadowOpacity]} onValueChange={(v) => setShadowOpacity(v[0])} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="color">Shadow Color</Label>
                                <Input id="color" type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="w-24 h-12 p-1"/>
                            </div>
                            <div className="flex items-center space-x-2">
                            <Switch id="inset-switch" checked={isInset} onCheckedChange={setIsInset} />
                            <Label htmlFor="inset-switch">Inset</Label>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-6">
                            <div className="h-64 flex-1 flex items-center justify-center bg-muted rounded-lg p-4">
                                <div className="w-40 h-40 bg-card rounded-lg" style={{ boxShadow: boxShadowStyle }}></div>
                            </div>
                            <Card className="w-full bg-muted">
                                <CardHeader className="flex-row items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Code className="h-5 w-5" />
                                        <CardTitle className="text-lg font-headline">Generated CSS</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                                        <Copy className="h-5 w-5" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <pre className="p-4 rounded-md bg-background/70 text-sm overflow-x-auto">
                                        <code>
                                            box-shadow: {boxShadowStyle};
                                        </code>
                                    </pre>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {boxShadowGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{boxShadowGuide.title}</CardTitle>
                                        <CardDescription>{boxShadowGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {boxShadowGuide.steps.map((step, stepIndex) => (
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
