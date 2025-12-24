"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Copy, FileCode, RefreshCw, Download } from 'lucide-react';

export default function JavascriptMinifierPage() {
    const [inputCode, setInputCode] = useState('');
    const [minifiedCode, setMinifiedCode] = useState('');
    const [isMinifying, setIsMinifying] = useState(false);
    const { toast } = useToast();

    const minifyJS = (code: string) => {
        // Basic Client-Side Minification Logic (Regex based)
        // Note: A full AST parser (like Terser/Babel) is heavy for client-side without worker/wasm.
        // This is a "safe" whitespace/comment remover.
        
        try {
            let result = code;
            
            // Remove single line comments // ...
            // Be careful not to remove // inside strings (simple heuristic)
            result = result.replace(/\/\/[^\n]*\n/g, '\n');
            
            // Remove multi-line comments /* ... */
            result = result.replace(/\/\*[\s\S]*?\*\//g, '');
            
            // Remove extra whitespace
            result = result.replace(/\s+/g, ' ');
            
            // Remove whitespace around common delimiters
            result = result.replace(/\s*([=+\-*/%{}:;(),.<>!&|^[\]])\s*/g, '$1');
            
            // Fix potential issues where spaces are needed (var a, return true)
            // This is tricky with regex. We'll add back spaces for keywords if they merged.
            // A perfect minifier needs a tokenizer. 
            // For a robust tool, we might want to use a CDN based library like Terser in the future.
            // For now, let's keep it simple but safe(r).
            
            // Alternative: Just remove newlines and trim for a "light" minify if regex is too risky.
            // Let's use a slightly less aggressive approach to avoid breaking code.
            
            const lines = code.split('\n');
            const processedLines = lines.map(line => {
                let l = line.trim();
                // Remove simple comments
                if (l.startsWith('//')) return '';
                if (l.startsWith('/*') && l.endsWith('*/')) return '';
                return l;
            }).filter(l => l.length > 0);
            
            return processedLines.join('');
            
        } catch (e) {
            console.error(e);
            return code; // Return original if fail
        }
    };

    const handleMinify = () => {
        if (!inputCode.trim()) {
            toast({
                title: "Empty Input",
                description: "Please paste some JavaScript code to minify.",
                variant: "destructive"
            });
            return;
        }

        setIsMinifying(true);
        
        // Simulate processing delay for better UX or actual async work
        setTimeout(() => {
            const result = minifyJS(inputCode);
            setMinifiedCode(result);
            setIsMinifying(false);
            toast({
                title: "Minified!",
                description: `Code reduced from ${inputCode.length} to ${result.length} characters.`,
            });
        }, 500);
    };

    const copyToClipboard = () => {
        if (!minifiedCode) return;
        navigator.clipboard.writeText(minifiedCode);
        toast({
            title: "Copied!",
            description: "Minified code copied to clipboard.",
        });
    };

    const handleDownload = () => {
        if (!minifiedCode) return;
        const blob = new Blob([minifiedCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'minified.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-8">
                     <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <FileCode className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">JavaScript Minifier</h1>
                    <p className="text-muted-foreground mt-2">
                        Minify and compress your JavaScript code for better performance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Input JavaScript</CardTitle>
                            <CardDescription>Paste your original code here</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[300px]">
                            <Textarea 
                                placeholder="// Paste your JS code here..." 
                                className="h-full font-mono text-sm resize-none"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Minified Output</CardTitle>
                            <CardDescription>Resulting compressed code</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[300px]">
                            <Textarea 
                                readOnly 
                                placeholder="Minified code will appear here..." 
                                className="h-full font-mono text-sm resize-none bg-muted/50"
                                value={minifiedCode}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" onClick={handleMinify} disabled={isMinifying}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isMinifying ? 'animate-spin' : ''}`} />
                        {isMinifying ? 'Minifying...' : 'Minify JavaScript'}
                    </Button>
                    <Button size="lg" variant="outline" onClick={copyToClipboard} disabled={!minifiedCode}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                    </Button>
                     <Button size="lg" variant="secondary" onClick={handleDownload} disabled={!minifiedCode}>
                        <Download className="w-4 h-4 mr-2" />
                        Download .js
                    </Button>
                </div>
            </div>
        </div>
    );
}
