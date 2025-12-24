"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { HardDrive } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FileSizeConverterPage() {
    const [inputValue, setInputValue] = useState('1');
    const [inputUnit, setInputUnit] = useState('MB');
    const [results, setResults] = useState<{ unit: string; value: string }[]>([]);
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

    useEffect(() => {
        convert(inputValue, inputUnit);
    }, [inputValue, inputUnit]);

    const convert = (val: string, unit: string) => {
        const num = parseFloat(val);
        if (isNaN(num)) {
            setResults([]);
            return;
        }

        // Convert to Bytes first
        let bytes = 0;
        const unitIndex = units.indexOf(unit);
        if (unitIndex === -1) return;

        bytes = num * Math.pow(1024, unitIndex);

        // Convert Bytes to all other units
        const newResults = units.map((u, index) => {
            const convertedVal = bytes / Math.pow(1024, index);
            
            // Format logic
            let formatted = '';
            if (convertedVal === 0) formatted = '0';
            else if (convertedVal < 0.000001) formatted = convertedVal.toExponential(4);
            else if (Number.isInteger(convertedVal)) formatted = convertedVal.toString();
            else formatted = convertedVal.toFixed(6).replace(/\.?0+$/, ""); // Remove trailing zeros

            return { unit: u, value: formatted };
        });

        setResults(newResults);
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <HardDrive className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">File Size Converter</h1>
                    <p className="text-muted-foreground mt-2">
                        Convert between B, KB, MB, GB, TB, and PB using 1024 binary base units.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Input Size</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter value"
                                className="text-lg"
                            />
                        </div>
                        <div className="w-32">
                            <Select value={inputUnit} onValueChange={setInputUnit}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map(u => (
                                        <SelectItem key={u} value={u}>{u}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {results.map((res) => (
                        <Card key={res.unit} className={`${res.unit === inputUnit ? 'border-primary bg-primary/5' : ''}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{res.unit}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate" title={res.value}>
                                    {res.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
