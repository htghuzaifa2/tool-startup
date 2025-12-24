"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Ruler, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TextWidthEstimator() {
    const [text, setText] = useState('Hello World');
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [width, setWidth] = useState(0);
    const measureRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (measureRef.current) {
            setWidth(measureRef.current.offsetWidth);
        }
    }, [text, fontSize, fontFamily]);

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Text Width Estimator
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Estimate pixel width of text with font and size. Great for UI/UX devs.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Ruler className="w-6 h-6 text-primary" />
                            Estimator
                        </CardTitle>
                        <CardDescription>Enter text and adjust font settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Text</Label>
                            <Input
                                id="input-text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="font-size">Font Size (px)</Label>
                                <Input
                                    id="font-size"
                                    type="number"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    min={1}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="font-family">Font Family</Label>
                                <Select value={fontFamily} onValueChange={setFontFamily}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Arial">Arial</SelectItem>
                                        <SelectItem value="Verdana">Verdana</SelectItem>
                                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                        <SelectItem value="Courier New">Courier New</SelectItem>
                                        <SelectItem value="Georgia">Georgia</SelectItem>
                                        <SelectItem value="Tahoma">Tahoma</SelectItem>
                                        <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                                        <SelectItem value="Impact">Impact</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="p-6 bg-muted rounded-lg text-center space-y-4">
                            <p className="text-sm text-muted-foreground">Estimated Width:</p>
                            <p className="text-4xl font-bold text-primary">{width} px</p>
                        </div>

                        {/* Hidden element for measurement */}
                        <span
                            ref={measureRef}
                            style={{
                                fontSize: `${fontSize}px`,
                                fontFamily: fontFamily,
                                visibility: 'hidden',
                                position: 'absolute',
                                whiteSpace: 'pre',
                                top: '-9999px',
                                left: '-9999px'
                            }}
                        >
                            {text}
                        </span>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
