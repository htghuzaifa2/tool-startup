"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UltraPercentCalculator() {
    // State for different calculator modes
    const [basicVal, setBasicVal] = useState('');
    const [basicPercent, setBasicPercent] = useState('');
    const [basicResult, setBasicResult] = useState<number | null>(null);

    const [increaseVal, setIncreaseVal] = useState('');
    const [increasePercent, setIncreasePercent] = useState('');
    const [increaseResult, setIncreaseResult] = useState<number | null>(null);

    const [decreaseVal, setDecreaseVal] = useState('');
    const [decreasePercent, setDecreasePercent] = useState('');
    const [decreaseResult, setDecreaseResult] = useState<number | null>(null);

    const calculateBasic = () => {
        const val = parseFloat(basicVal);
        const pct = parseFloat(basicPercent);
        if (!isNaN(val) && !isNaN(pct)) {
            setBasicResult((val * pct) / 100);
        }
    };

    const calculateIncrease = () => {
        const val = parseFloat(increaseVal);
        const pct = parseFloat(increasePercent);
        if (!isNaN(val) && !isNaN(pct)) {
            setIncreaseResult(val * (1 + pct / 100));
        }
    };

    const calculateDecrease = () => {
        const val = parseFloat(decreaseVal);
        const pct = parseFloat(decreasePercent);
        if (!isNaN(val) && !isNaN(pct)) {
            setDecreaseResult(val * (1 - pct / 100));
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Ultra % Calculator
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Calculate percentages, increases, decreases, and more instantly.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="w-6 h-6 text-primary" />
                            Calculator
                        </CardTitle>
                        <CardDescription>Select a calculation mode below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="basic">% of Value</TabsTrigger>
                                <TabsTrigger value="increase">Increase by %</TabsTrigger>
                                <TabsTrigger value="decrease">Decrease by %</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                    <div className="space-y-2">
                                        <Label>What is</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="10"
                                                value={basicPercent}
                                                onChange={(e) => setBasicPercent(e.target.value)}
                                            />
                                            <span className="absolute right-3 top-2 text-muted-foreground">%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>of</Label>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            value={basicVal}
                                            onChange={(e) => setBasicVal(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button onClick={calculateBasic} className="w-full">Calculate</Button>
                                {basicResult !== null && (
                                    <div className="p-4 bg-muted rounded-lg text-center">
                                        <p className="text-sm text-muted-foreground">Result:</p>
                                        <p className="text-3xl font-bold text-primary">{basicResult}</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="increase" className="space-y-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                    <div className="space-y-2">
                                        <Label>Start Value</Label>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            value={increaseVal}
                                            onChange={(e) => setIncreaseVal(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Increase by</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="20"
                                                value={increasePercent}
                                                onChange={(e) => setIncreasePercent(e.target.value)}
                                            />
                                            <span className="absolute right-3 top-2 text-muted-foreground">%</span>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={calculateIncrease} className="w-full">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Calculate Increase
                                </Button>
                                {increaseResult !== null && (
                                    <div className="p-4 bg-green-50 rounded-lg text-center dark:bg-green-900/20">
                                        <p className="text-sm text-muted-foreground">New Value:</p>
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{increaseResult}</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="decrease" className="space-y-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                    <div className="space-y-2">
                                        <Label>Start Value</Label>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            value={decreaseVal}
                                            onChange={(e) => setDecreaseVal(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Decrease by</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="20"
                                                value={decreasePercent}
                                                onChange={(e) => setDecreasePercent(e.target.value)}
                                            />
                                            <span className="absolute right-3 top-2 text-muted-foreground">%</span>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={calculateDecrease} className="w-full">
                                    <TrendingDown className="w-4 h-4 mr-2" />
                                    Calculate Decrease
                                </Button>
                                {decreaseResult !== null && (
                                    <div className="p-4 bg-red-50 rounded-lg text-center dark:bg-red-900/20">
                                        <p className="text-sm text-muted-foreground">New Value:</p>
                                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">{decreaseResult}</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
