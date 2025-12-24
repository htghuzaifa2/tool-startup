
"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Timer, Play, Pause, RotateCcw, Flag, Trash2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/hooks/use-toast';


const formatTime = (time: number) => {
    const milliseconds = `0${Math.floor((time % 1000) / 10)}`.slice(-2);
    const seconds = `0${Math.floor(time / 1000) % 60}`.slice(-2);
    const minutes = `0${Math.floor(time / 60000) % 60}`.slice(-2);
    return `${minutes}:${seconds}.${milliseconds}`;
};

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            const startTime = Date.now() - time;
            timerRef.current = window.setInterval(() => {
                setTime(Date.now() - startTime);
            }, 10);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, time]);

    const handleStartPause = () => setIsRunning(!isRunning);
    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    };
    const handleLap = () => {
        if (isRunning) {
            setLaps(prevLaps => [...prevLaps, time]);
        }
    };
    const handleClearLaps = () => setLaps([]);

    return (
        <Card>
            <CardContent className="pt-6 text-center space-y-6">
                <p className="text-6xl md:text-8xl font-mono font-bold tabular-nums">
                    {formatTime(time)}
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                    <Button onClick={handleStartPause} size="lg" className="w-28 sm:w-32">
                        {isRunning ? <><Pause className="mr-2"/>Pause</> : <><Play className="mr-2"/>Start</>}
                    </Button>
                    <Button onClick={handleReset} size="lg" variant="outline" className="w-28 sm:w-32">
                        <RotateCcw className="mr-2"/>Reset
                    </Button>
                     <Button onClick={handleLap} size="lg" variant="secondary" className="w-28 sm:w-32" disabled={!isRunning}>
                        <Flag className="mr-2"/>Lap
                    </Button>
                </div>

                {laps.length > 0 && (
                    <Card className="text-left bg-muted">
                        <CardHeader className="flex-row items-center justify-between py-3 px-4">
                           <CardTitle className="text-lg font-headline">Laps</CardTitle>
                           <Button variant="ghost" size="icon" onClick={handleClearLaps}><Trash2 className="h-5 w-5 text-muted-foreground"/></Button>
                        </CardHeader>
                        <CardContent className="p-0">
                           <ScrollArea className="h-48">
                               <ul className="divide-y">
                                   {laps.map((lap, index) => (
                                       <li key={index} className="flex justify-between items-center px-4 py-2 font-mono">
                                           <span className="text-muted-foreground">Lap {index + 1}</span>
                                           <span>{formatTime(lap)}</span>
                                       </li>
                                   ))}
                               </ul>
                           </ScrollArea>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}

const CountdownTimer = () => {
    const [duration, setDuration] = useState(300); // 5 minutes in seconds
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<number | null>(null);
    const { toast } = useToast();

    const handleTimerEnd = useCallback(() => {
        toast({
            title: "Time's up!",
            description: "Your countdown timer has finished.",
        });
        setIsRunning(false);
    }, [toast]);
    
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 0) {
                        if(timerRef.current) clearInterval(timerRef.current);
                        handleTimerEnd();
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        } else if (!isRunning || timeLeft === 0) {
             if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current) };
    }, [isRunning, timeLeft, handleTimerEnd]);
    
    const handleStartPause = () => {
        if (timeLeft > 0) {
            setIsRunning(!isRunning);
        }
    };
    
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(duration);
    };

    const handleSetDuration = (minutes: number) => {
        const newDuration = minutes * 60;
        setDuration(newDuration);
        if (!isRunning) {
            setTimeLeft(newDuration);
        }
    };
    
    const formatCountdown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <Card>
            <CardContent className="pt-6 text-center space-y-6">
                <div className="relative">
                    <p className="text-6xl md:text-8xl font-mono font-bold tabular-nums">
                        {formatCountdown(timeLeft)}
                    </p>
                    <Progress value={duration > 0 ? (timeLeft / duration) * 100 : 0} className="absolute bottom-0 h-1"/>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                    <Button onClick={handleStartPause} size="lg" className="w-32" disabled={timeLeft === 0}>
                         {isRunning ? <><Pause className="mr-2"/>Pause</> : <><Play className="mr-2"/>Start</>}
                    </Button>
                    <Button onClick={handleReset} size="lg" variant="outline" className="w-32">
                        <RotateCcw className="mr-2"/>Reset
                    </Button>
                </div>
                
                 <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Set timer (minutes)</p>
                     <div className="flex flex-wrap justify-center gap-2">
                        <Button variant="secondary" onClick={() => handleSetDuration(1)}>1</Button>
                        <Button variant="secondary" onClick={() => handleSetDuration(5)}>5</Button>
                        <Button variant="secondary" onClick={() => handleSetDuration(10)}>10</Button>
                        <Button variant="secondary" onClick={() => handleSetDuration(15)}>15</Button>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};

export default function StopwatchTimerPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <Card className="overflow-hidden">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                           <Timer className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Stopwatch &amp; Timer</CardTitle>
                        <CardDescription>Precise timing tools for every need, available offline.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="stopwatch" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
                                <TabsTrigger value="timer">Timer</TabsTrigger>
                            </TabsList>
                            <TabsContent value="stopwatch" className="pt-6">
                                <Stopwatch />
                            </TabsContent>
                             <TabsContent value="timer" className="pt-6">
                                <CountdownTimer />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
