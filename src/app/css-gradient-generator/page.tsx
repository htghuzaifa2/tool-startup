
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Code, Pipette, PlusCircle, Trash2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


type ColorStop = {
  id: number;
  color: string;
  position: number;
};

export default function CssGradientGeneratorPage() {
    const [gradientType, setGradientType] = useState('linear');
    const [angle, setAngle] = useState(90);
    const [colors, setColors] = useState<ColorStop[]>([
        { id: 1, color: '#3F51B5', position: 0 },
        { id: 2, color: '#7952B3', position: 100 },
    ]);
    const { toast } = useToast();
    const gradientGuide = guides.find(g => g.href.includes('css-gradient-generator'));

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

    const generateGradientCss = () => {
        const colorStops = colors
            .sort((a, b) => a.position - b.position)
            .map(c => `${c.color} ${c.position}%`)
            .join(', ');

        if (gradientType === 'linear') {
            return `linear-gradient(${angle}deg, ${colorStops})`;
        }
        return `radial-gradient(circle, ${colorStops})`;
    };

    const gradientCss = generateGradientCss();

    const copyToClipboard = () => {
        const codeToCopy = `background: ${gradientCss};`;
        navigator.clipboard.writeText(codeToCopy);
        toast({
            title: "Copied!",
            description: "CSS gradient code copied to clipboard.",
        });
    };

    const addColor = () => {
        const newColor: ColorStop = {
            id: Date.now(),
            color: '#FFFFFF',
            position: 50,
        };
        setColors([...colors, newColor]);
    };

    const removeColor = (id: number) => {
        setColors(colors.filter(c => c.id !== id));
    };

    const updateColor = (id: number, field: 'color' | 'position', value: string | number) => {
        setColors(colors.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Pipette className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">CSS Gradient Generator</CardTitle>
                        <CardDescription>Visually design linear and radial gradients and copy the CSS.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6 p-4 border rounded-lg">
                            <Tabs defaultValue="linear" onValueChange={setGradientType} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="linear">Linear</TabsTrigger>
                                    <TabsTrigger value="radial">Radial</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {gradientType === 'linear' && (
                                <div className="space-y-4">
                                    <Label htmlFor="angle">Angle: <span className="font-bold">{angle}°</span></Label>
                                    <Slider id="angle" min={0} max={360} value={[angle]} onValueChange={(v) => setAngle(v[0])} />
                                </div>
                            )}
                            
                            <div className="space-y-4">
                                <Label className="font-bold">Color Stops</Label>
                                {colors.map((colorStop, index) => (
                                    <div key={colorStop.id} className="flex items-center gap-4 p-2 rounded-md bg-muted">
                                        <Input 
                                            type="color" 
                                            value={colorStop.color} 
                                            onChange={(e) => updateColor(colorStop.id, 'color', e.target.value)} 
                                            className="w-16 h-12 p-1"
                                        />
                                        <div className="flex-1">
                                            <Input 
                                            type="text" 
                                            value={colorStop.color.toUpperCase()} 
                                            onChange={(e) => updateColor(colorStop.id, 'color', e.target.value)}
                                            className="font-mono"
                                            />
                                            <Slider
                                                min={0}
                                                max={100}
                                                value={[colorStop.position]}
                                                onValueChange={(v) => updateColor(colorStop.id, 'position', v[0])}
                                                className="mt-2"
                                            />
                                        </div>
                                        {colors.length > 2 && (
                                            <Button variant="ghost" size="icon" onClick={() => removeColor(colorStop.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <Button variant="outline" onClick={addColor} className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Color Stop
                            </Button>
                        </div>
                        <div className="flex flex-col space-y-6">
                            <div className="h-80 w-full flex-1 rounded-lg border shadow-inner" style={{ background: gradientCss }}></div>
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
                                            background: {gradientCss};
                                        </code>
                                    </pre>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {gradientGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{gradientGuide.title}</CardTitle>
                                        <CardDescription>{gradientGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {gradientGuide.steps.map((step, stepIndex) => (
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
