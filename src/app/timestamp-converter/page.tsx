"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Clock, RefreshCw } from 'lucide-react';
import { Label } from "@/components/ui/label";

export default function TimestampConverterPage() {
    const [timestamp, setTimestamp] = useState('');
    const [dateString, setDateString] = useState('');
    const [humanDate, setHumanDate] = useState('');
    const { toast } = useToast();

    // Initialize with current time
    useEffect(() => {
        const now = Math.floor(Date.now() / 1000);
        setTimestamp(now.toString());
        convertTimestampToDate(now.toString());
    }, []);

    const convertTimestampToDate = (ts: string) => {
        if (!ts) {
            setHumanDate('');
            return;
        }
        try {
            // Handle both seconds and milliseconds (heuristic: > 10000000000 is likely ms)
            let val = parseInt(ts, 10);
            if (isNaN(val)) throw new Error("Invalid number");
            
            // Heuristic for seconds vs ms
            // 3000000000 is year 2065. If it's bigger, assume ms.
            // 10000000000 (10 billion) is usually a safe cutoff for ms
            if (val > 100000000000) {
                 // It's likely MS
            } else {
                 val = val * 1000;
            }

            const date = new Date(val);
            setHumanDate(date.toUTCString() + " | " + date.toLocaleString());
            // ISO string for the other input
            try {
                 setDateString(date.toISOString().slice(0, 16)); // yyyy-MM-ddThh:mm
            } catch (e) {
                // Ignore if invalid date
            }
        } catch (e) {
            setHumanDate("Invalid Timestamp");
        }
    };

    const convertDateToTimestamp = (dateStr: string) => {
        if (!dateStr) return;
        try {
            const date = new Date(dateStr);
            const ts = Math.floor(date.getTime() / 1000);
            setTimestamp(ts.toString());
            setHumanDate(date.toUTCString() + " | " + date.toLocaleString());
        } catch (e) {
             setTimestamp("Invalid Date");
        }
    };

    const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTimestamp(val);
        convertTimestampToDate(val);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDateString(val);
        convertDateToTimestamp(val);
    };

    const setNow = () => {
        const now = Math.floor(Date.now() / 1000);
        setTimestamp(now.toString());
        convertTimestampToDate(now.toString());
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Timestamp Converter</h1>
                    <p className="text-muted-foreground mt-2">
                        Convert Unix timestamps to human-readable dates and vice versa.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Converter</CardTitle>
                        <CardDescription>Enter a timestamp or select a date</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="timestamp">Unix Timestamp (Seconds)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="timestamp"
                                    type="number"
                                    value={timestamp}
                                    onChange={handleTimestampChange}
                                    placeholder="e.g. 1678900000"
                                />
                                <Button variant="outline" onClick={setNow} title="Set to Now">
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-muted"></div>
                            <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs">OR</span>
                            <div className="flex-grow border-t border-muted"></div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date & Time (Local)</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                value={dateString}
                                onChange={handleDateChange}
                            />
                        </div>

                        <div className="mt-8 p-6 bg-muted rounded-lg text-center">
                            <p className="text-sm text-muted-foreground mb-1">Human Readable Result</p>
                            <p className="text-xl font-mono font-medium">{humanDate || "Waiting for input..."}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
