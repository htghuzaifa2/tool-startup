"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, FileText } from 'lucide-react';

export default function JsonToCsv() {
    const [jsonInput, setJsonInput] = useState('');
    const [csvOutput, setCsvOutput] = useState('');
    const { toast } = useToast();

    const convertJsonToCsv = () => {
        if (!jsonInput.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter JSON data to convert.",
                variant: "destructive"
            });
            return;
        }

        try {
            let jsonData = JSON.parse(jsonInput);

            // If it's not an array, wrap it in an array
            if (!Array.isArray(jsonData)) {
                jsonData = [jsonData];
            }

            if (jsonData.length === 0) {
                toast({
                    title: "Empty Array",
                    description: "JSON array is empty.",
                    variant: "destructive"
                });
                return;
            }

            // Get headers from all keys in all objects
            const headers: string[] = Array.from(new Set(jsonData.flatMap((obj: any) => Object.keys(obj))));

            const csvRows = [
                headers.join(','), // Header row
                ...jsonData.map((row: any) =>
                    headers.map((fieldName: string) => {
                        let value = row[fieldName] ?? '';
                        // Escape quotes and wrap in quotes if contains comma or newline
                        if (typeof value === 'string') {
                            value = value.replace(/"/g, '""');
                            if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                                value = `"${value}"`;
                            }
                        }
                        return value;
                    }).join(',')
                )
            ];

            setCsvOutput(csvRows.join('\n'));
            toast({
                title: "Converted!",
                description: "JSON converted to CSV successfully.",
            });

        } catch (error) {
            toast({
                title: "Invalid JSON",
                description: "Please enter valid JSON data.",
                variant: "destructive"
            });
        }
    };

    const copyToClipboard = () => {
        if (!csvOutput) return;
        navigator.clipboard.writeText(csvOutput);
        toast({
            title: "Copied!",
            description: "CSV copied to clipboard.",
        });
    };

    const clearAll = () => {
        setJsonInput('');
        setCsvOutput('');
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        JSON to CSV Converter
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Convert JSON data to CSV format quickly and easily.
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-6 h-6 text-primary" />
                            Converter
                        </CardTitle>
                        <CardDescription>Paste your JSON below to convert it to CSV.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="json-input">Input JSON</Label>
                            <Textarea
                                id="json-input"
                                placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
                                className="min-h-[200px] font-mono text-sm"
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={convertJsonToCsv} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Convert to CSV
                            </Button>
                            <Button variant="outline" onClick={clearAll}>
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="csv-output">Output CSV</Label>
                            <div className="relative">
                                <Textarea
                                    id="csv-output"
                                    placeholder="name,age&#10;John,30&#10;Jane,25"
                                    className="min-h-[200px] font-mono text-sm"
                                    value={csvOutput}
                                    readOnly
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2 h-8"
                                    onClick={copyToClipboard}
                                    disabled={!csvOutput}
                                >
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
