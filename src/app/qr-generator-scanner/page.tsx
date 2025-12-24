"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { QrCode, Download } from 'lucide-react';
import QRCode from 'qrcode';
import Image from 'next/image';

export default function QrGeneratorScanner() {
    const [inputText, setInputText] = useState('');
    const [qrImage, setQrImage] = useState('');
    const { toast } = useToast();

    const generateQR = async () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter text or URL.",
                variant: "destructive"
            });
            return;
        }

        try {
            const url = await QRCode.toDataURL(inputText, { width: 400, margin: 2 });
            setQrImage(url);
            toast({
                title: "Generated!",
                description: "QR Code created successfully.",
            });
        } catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "Failed to generate QR Code.",
                variant: "destructive"
            });
        }
    };

    const downloadQR = () => {
        if (!qrImage) return;
        const link = document.createElement('a');
        link.href = qrImage;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        QR Generator & Scanner
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Create custom QR codes in seconds. (Scanning coming soon!)
                    </p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="w-6 h-6 text-primary" />
                            Generator
                        </CardTitle>
                        <CardDescription>Enter URL or text to generate QR.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="input-text">Content</Label>
                            <Input
                                id="input-text"
                                placeholder="https://example.com"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={generateQR} className="flex-1">
                                <QrCode className="w-4 h-4 mr-2" />
                                Generate QR
                            </Button>
                            <Button variant="outline" onClick={() => { setInputText(''); setQrImage(''); }}>
                                Clear
                            </Button>
                        </div>

                        {qrImage && (
                            <div className="flex flex-col items-center space-y-4 pt-4">
                                <div className="border p-4 rounded-lg bg-white">
                                    <Image src={qrImage} alt="QR Code" width={256} height={256} />
                                </div>
                                <Button onClick={downloadQR} variant="secondary">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PNG
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
