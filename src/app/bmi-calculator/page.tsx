
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function BmiCalculatorPage() {
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
    
    // Metric state
    const [heightCm, setHeightCm] = useState('');
    const [weightKg, setWeightKg] = useState('');

    // Imperial state
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');
    const [weightLbs, setWeightLbs] = useState('');

    const [bmi, setBmi] = useState<number | null>(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const { toast } = useToast();
    const bmiCalculatorGuide = guides.find(g => g.href.includes('bmi-calculator'));

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

    const calculateBmi = () => {
        setBmi(null);
        setBmiCategory('');

        let heightMeters = 0;
        let weightKilos = 0;

        try {
            if (unit === 'metric') {
                const h = parseFloat(heightCm);
                const w = parseFloat(weightKg);
                if (isNaN(h) || h <= 0 || isNaN(w) || w <= 0) {
                    throw new Error('Please enter positive numbers for height and weight.');
                }
                heightMeters = h / 100;
                weightKilos = w;
            } else { // Imperial
                const ft = parseFloat(heightFt);
                const inch = heightIn ? parseFloat(heightIn) : 0;
                const lbs = parseFloat(weightLbs);
                if (isNaN(ft) || ft <= 0 || isNaN(inch) || inch < 0 || isNaN(lbs) || lbs <= 0) {
                    throw new Error('Please enter a positive number for feet and pounds.');
                }
                heightMeters = ((ft * 12) + inch) * 0.0254;
                weightKilos = lbs * 0.453592;
            }

            if (heightMeters === 0) {
                 throw new Error('Height cannot be zero.');
            }

            const bmiValue = weightKilos / (heightMeters * heightMeters);

            if (!isFinite(bmiValue)) {
                throw new Error('Calculation resulted in an invalid number. Please check your inputs.');
            }

            setBmi(bmiValue);
            setBmiCategory(getBmiCategory(bmiValue));
        } catch (error: any) {
            toast({ title: 'Invalid Input', description: error.message, variant: 'destructive'});
        }
    };

    const getBmiCategory = (bmi: number) => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
        if (bmi >= 25 && bmi < 29.9) return 'Overweight';
        return 'Obesity';
    };
    
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Underweight': return 'text-blue-500';
            case 'Normal weight': return 'text-green-500';
            case 'Overweight': return 'text-yellow-500';
            case 'Obesity': return 'text-red-500';
            default: return '';
        }
    }

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
      if (/^\d*\.?\d*$/.test(value)) {
        setter(value);
      }
    }


    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold font-headline">BMI Calculator</CardTitle>
                        <CardDescription>Calculate your Body Mass Index.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Tabs defaultValue="metric" onValueChange={(value) => setUnit(value as 'metric' | 'imperial')} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="metric">Metric</TabsTrigger>
                                <TabsTrigger value="imperial">Imperial</TabsTrigger>
                            </TabsList>
                            <TabsContent value="metric" className="space-y-4 pt-4">
                                <Input type="number" placeholder="Height (cm)" value={heightCm} onChange={e => handleInputChange(setHeightCm, e.target.value)} />
                                <Input type="number" placeholder="Weight (kg)" value={weightKg} onChange={e => handleInputChange(setWeightKg, e.target.value)} />
                            </TabsContent>
                            <TabsContent value="imperial" className="space-y-4 pt-4">
                               <div className="flex gap-4">
                                 <Input type="number" placeholder="Height (ft)" value={heightFt} onChange={e => handleInputChange(setHeightFt, e.target.value)} />
                                 <Input type="number" placeholder="Height (in)" value={heightIn} onChange={e => handleInputChange(setHeightIn, e.target.value)} />
                               </div>
                                <Input type="number" placeholder="Weight (lbs)" value={weightLbs} onChange={e => handleInputChange(setWeightLbs, e.target.value)} />
                            </TabsContent>
                        </Tabs>

                        <Button onClick={calculateBmi} size="lg" className="w-full">Calculate BMI</Button>
                        
                        {bmi !== null && (
                            <Card className="text-center p-6 bg-muted">
                                <p className="text-lg text-muted-foreground">Your BMI is</p>
                                <p className="text-5xl font-bold">{bmi.toFixed(1)}</p>
                                <p className={`text-2xl font-semibold ${getCategoryColor(bmiCategory)}`}>{bmiCategory}</p>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                {bmiCalculatorGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{bmiCalculatorGuide.title}</CardTitle>
                                        <CardDescription>{bmiCalculatorGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {bmiCalculatorGuide.steps.map((step, stepIndex) => (
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
