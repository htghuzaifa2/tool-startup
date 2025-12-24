
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, Palette } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


// Color conversion utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
    if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
    const r_ = r / 255, g_ = g / 255, b_ = b / 255;
    const k = 1 - Math.max(r_, g_, b_);
    const c = (1 - r_ - k) / (1 - k);
    const m = (1 - g_ - k) / (1 - k);
    const y = (1 - b_ - k) / (1 - k);
    return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
}

function rgbToHwb(r: number, g: number, b: number): { h: number; w: number; b: number } {
    r /= 255; g /= 255; b /= 255;
    const { h } = rgbToHsl(r * 255, g * 255, b * 255);
    const w = Math.min(r, g, b);
    const bl = 1 - Math.max(r, g, b);
    return { h, w: Math.round(w * 100), b: Math.round(bl * 100) };
}


export default function ColorPickerPage() {
    const [color, setColor] = useState('#3F51B5');
    const { toast } = useToast();
    const colorPickerGuide = guides.find(g => g.href.includes('color-picker'));
    
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

    const rgb = hexToRgb(color);
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
    const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;
    const hwb = rgb ? rgbToHwb(rgb.r, rgb.g, rgb.b) : null;

    const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'N/A';
    const hslString = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : 'N/A';
    const cmykString = cmyk ? `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` : 'N/A';
    const hwbString = hwb ? `hwb(${hwb.h}, ${hwb.w}%, ${hwb.b}%)` : 'N/A';

    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to Clipboard!",
            description: `${format} code ${text} copied.`,
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Palette className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Color Picker</CardTitle>
                        <CardDescription>Select a color and get its codes instantly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="h-48 w-full rounded-lg border shadow-inner" style={{ backgroundColor: color }}></div>
                        
                        <div className="flex items-center gap-4">
                            <label htmlFor="color-picker" className="font-medium">Pick a color:</label>
                            <Input
                                id="color-picker"
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-12 w-24 p-1 cursor-pointer"
                            />
                        </div>
                        
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">HEX</p>
                                        <p className="font-mono text-muted-foreground">{color.toUpperCase()}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(color.toUpperCase(), 'HEX')}>
                                        <Copy className="h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">RGB</p>
                                        <p className="font-mono text-muted-foreground">{rgbString}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(rgbString, 'RGB')}>
                                        <Copy className="h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">HSL</p>
                                        <p className="font-mono text-muted-foreground">{hslString}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(hslString, 'HSL')}>
                                        <Copy className="h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">CMYK</p>
                                        <p className="font-mono text-muted-foreground">{cmykString}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(cmykString, 'CMYK')}>
                                        <Copy className="h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">HWB</p>
                                        <p className="font-mono text-muted-foreground">{hwbString}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(hwbString, 'HWB')}>
                                        <Copy className="h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {colorPickerGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{colorPickerGuide.title}</CardTitle>
                                        <CardDescription>{colorPickerGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {colorPickerGuide.steps.map((step, stepIndex) => (
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
