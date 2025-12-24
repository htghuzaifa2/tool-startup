
"use client"

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Gift, Play, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';
import confetti from 'canvas-confetti';
import { ScrollArea } from '@/components/ui/scroll-area';


// Final, Modern, High-Contrast Color Palettes
const themeColors = {
    // Synthwave/Neon palette for dark backgrounds
    dark: ['#ff00ff', '#00ffff', '#9d00ff', '#ff005d', '#00ff8a', '#ff9e00'],
    blue: ['#ff00ff', '#00ffff', '#9d00ff', '#ff005d', '#00ff8a', '#ff9e00'],
    // Vibrant Pop for light backgrounds
    light: ['#e6007e', '#007bff', '#7f00e6', '#00c497', '#e65c00', '#2d00e6'],
    // Cosmic Flame for orange theme (contrast with blues/purples)
    orange: ['#007bff', '#6f00ff', '#00e5ff', '#ff00a2', '#00ff9d', '#b400ff'],
};

const getCurrentThemeColors = () => {
    if (typeof window === 'undefined') return themeColors.dark;
    const root = document.documentElement;
    if (root.classList.contains('theme-blue')) return themeColors.blue;
    if (root.classList.contains('theme-orange')) return themeColors.orange;
    if (root.classList.contains('light')) return themeColors.light;
    return themeColors.dark;
}

export default function RandomPickerWheelPage() {
    const [newOption, setNewOption] = useState('');
    const [options, setOptions] = useState<string[]>(['Prize 1', 'Better Luck Next Time', '2x Bonus', 'Another Spin', 'Grand Prize', 'Small Reward']);
    const [isSpinning, setIsSpinning] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { toast, dismiss } = useToast();
    const pickerWheelGuide = guides.find(g => g.href.includes('random-picker-wheel'));
    const [currentAngle, setCurrentAngle] = useState(0);
    const [colors, setColors] = useState(themeColors.dark);
    const [lastToastId, setLastToastId] = useState<string | null>(null);

    const handleGuideClick = () => {
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80;
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    };

    const drawWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !options.length) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const arc = Math.PI * 2 / options.length;
        const center = canvas.width / 2;
        const outsideRadius = center - 10;
        const textRadius = outsideRadius * 0.75;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < options.length; i++) {
            const angle = i * arc;
            ctx.fillStyle = colors[i % colors.length];

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, outsideRadius, angle, angle + arc, false);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'hsl(var(--background))';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.save();
            ctx.fillStyle = "#FFF";
            ctx.strokeStyle = "rgba(0,0,0,0.6)"; // Outline for text
            ctx.lineWidth = 2;
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.translate(
                center + textRadius * Math.cos(angle + arc / 2),
                center + textRadius * Math.sin(angle + arc / 2)
            );
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            const text = options[i];
            ctx.strokeText(text, -ctx.measureText(text).width / 2, 0);
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

    }, [options, colors]);
    
    useEffect(() => {
        setColors(getCurrentThemeColors());
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setColors(getCurrentThemeColors());
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const resizeCanvas = () => {
          const canvas = canvasRef.current;
          if (canvas && canvas.parentElement) {
            const size = Math.min(canvas.parentElement.clientWidth, 450);
            canvas.width = size;
            canvas.height = size;
            drawWheel();
          }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [drawWheel]);
    
     useEffect(() => {
        drawWheel();
    }, [options, colors, drawWheel]);

    const handleAddOption = () => {
        if (newOption.trim() === '') {
            toast({ title: "Option cannot be empty.", variant: "destructive" });
            return;
        }
        if (options.length >= 100) {
            toast({ title: "Maximum options reached.", variant: "destructive" });
            return;
        }
        setOptions([...options, newOption.trim()]);
        setNewOption('');
    }
    
    const handleRemoveOption = (indexToRemove: number) => {
        setOptions(options.filter((_, index) => index !== indexToRemove));
    }

    const handleSpin = () => {
        if (isSpinning || options.length < 2) return;
        
        if (lastToastId) {
            dismiss(lastToastId);
        }
        setIsSpinning(true);
        
        // 1. Determine winner beforehand for true randomness
        const winnerIndex = Math.floor(Math.random() * options.length);
        const winner = options[winnerIndex];
        const arcSize = 360 / options.length;
        
        // 2. Calculate the exact angle to stop at the pointer
        // The pointer is at the top (270 degrees or -90). We want the middle of the segment there.
        const winnerAngle = (winnerIndex * arcSize) + (arcSize / 2);
        const stopAngle = 270 - winnerAngle;
        
        // 3. Add random rotations for visual variety
        const randomRotations = Math.floor(Math.random() * 5) + 8; // 8 to 12 full spins
        const finalAngle = (randomRotations * 360) + stopAngle;

        // Use functional update to ensure we're adding to the latest angle state
        setCurrentAngle(prevAngle => prevAngle + finalAngle);
        
        setTimeout(() => {
            const { id } = toast({
                title: "We have a winner!",
                description: `Congratulations: ${winner}`,
                duration: Infinity,
            });
            setLastToastId(id);
            
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 }
            });

            setIsSpinning(false);
        }, 6000); // This duration must match the CSS transition duration
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-6xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Gift className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Random Picker Wheel</CardTitle>
                        <CardDescription>Add options, spin the wheel, and let fate decide a winner!</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="new-option-input">Add an Option</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="new-option-input"
                                        placeholder="Enter a new option..."
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                                        disabled={isSpinning}
                                    />
                                    <Button onClick={handleAddOption} disabled={isSpinning}><Plus className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <ScrollArea className="h-72 w-full rounded-md border p-2">
                                <div className="space-y-2">
                                    {options.length > 0 ? options.map((option, index) => (
                                        <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                                            <span className="truncate pr-2">{option}</span>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)} disabled={isSpinning}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    )) : (
                                        <p className="text-muted-foreground text-center py-12">Add some options to get started!</p>
                                    )}
                                </div>
                            </ScrollArea>
                             <Button onClick={handleSpin} disabled={isSpinning || options.length < 2} size="lg" className="w-full">
                                <Play className="mr-2" /> {isSpinning ? 'Spinning...' : 'Spin The Wheel'}
                            </Button>
                        </div>
                        <div className="relative flex items-center justify-center w-full min-h-[300px] md:min-h-[450px]" style={{overflow: 'hidden'}}>
                            <div 
                                className="absolute top-0 left-1/2 -translate-x-1/2 z-10" 
                                style={{
                                    borderLeft: '15px solid transparent',
                                    borderRight: '15px solid transparent',
                                    borderTop: '30px solid hsl(var(--destructive))',
                                    filter: 'drop-shadow(0px -2px 2px rgba(0,0,0,0.2))'
                                }}
                            ></div>
                           <canvas 
                                ref={canvasRef}
                                style={{
                                    transform: `rotate(${currentAngle}deg)`,
                                    transition: isSpinning ? 'transform 6s cubic-bezier(0.2, 0.8, 0.4, 1)' : 'none',
                                }}
                           ></canvas>
                           <Button 
                             onClick={handleSpin}
                             disabled={isSpinning || options.length < 2}
                             className="absolute z-10 w-24 h-24 rounded-full border-4 border-background text-lg font-bold shadow-lg"
                             variant="secondary"
                           >
                             SPIN
                           </Button>
                        </div>
                    </CardContent>
                </Card>

                {pickerWheelGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{pickerWheelGuide.title}</CardTitle>
                                        <CardDescription>{pickerWheelGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {pickerWheelGuide.steps.map((step, stepIndex) => (
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
