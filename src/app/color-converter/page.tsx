"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Palette } from 'lucide-react';

export default function ColorConverter() {
    const [hex, setHex] = useState('#000000');
    const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
    const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 });
    const { toast } = useToast();

    // Convert Hex to others
    const handleHexChange = (val: string) => {
        setHex(val);
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            const r = parseInt(val.substring(1, 3), 16);
            const g = parseInt(val.substring(3, 5), 16);
            const b = parseInt(val.substring(5, 7), 16);
            setRgb({ r, g, b });
            updateHslFromRgb(r, g, b);
        }
    };

    const updateHslFromRgb = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        setHsl({ h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) });
    };

    // Update from Color Picker
    const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleHexChange(e.target.value);
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `${type} value copied to clipboard.`,
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Color Converter
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Convert colors between HEX, RGB, and HSL formats instantly.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="w-6 h-6 text-primary" />
                            Converter
                        </CardTitle>
                        <CardDescription>Pick a color or enter values.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                             {/* Color Preview & Picker */}
                            <div className="flex flex-col items-center gap-4">
                                <div 
                                    className="w-32 h-32 rounded-full border-4 border-muted shadow-xl"
                                    style={{ backgroundColor: hex }}
                                ></div>
                                <div className="relative">
                                    <Input 
                                        type="color" 
                                        value={hex}
                                        onChange={handleColorPicker}
                                        className="w-full h-10 p-1 cursor-pointer"
                                    />
                                    <span className="text-xs text-muted-foreground text-center block mt-1">Click to pick</span>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="flex-1 w-full space-y-4">
                                <div className="space-y-2">
                                    <Label>HEX</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            value={hex} 
                                            onChange={(e) => handleHexChange(e.target.value)}
                                            maxLength={7}
                                        />
                                        <Button size="icon" variant="outline" onClick={() => copyToClipboard(hex, 'HEX')}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>RGB</Label>
                                    <div className="flex gap-2">
                                        <Input value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly />
                                        <Button size="icon" variant="outline" onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>HSL</Label>
                                    <div className="flex gap-2">
                                        <Input value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} readOnly />
                                        <Button size="icon" variant="outline" onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
