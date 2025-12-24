
"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, Download, RefreshCw, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function ImageCompressorPage() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalPreview, setOriginalPreview] = useState<string | null>(null);
    const [originalSize, setOriginalSize] = useState(0);

    const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
    const [compressedSize, setCompressedSize] = useState(0);
    
    const [quality, setQuality] = useState(0.8);
    const [isCompressing, setIsCompressing] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const imageCompressorGuide = guides.find(g => g.href.includes('image-compressor'));

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                handleReset();
                setOriginalFile(file);
                setOriginalSize(file.size);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setOriginalPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                toast({
                    title: "Invalid File",
                    description: "Please select an image file (JPG, PNG, WEBP).",
                    variant: "destructive",
                });
            }
        }
    };

    const handleCompress = () => {
        if (!originalFile || !originalPreview) {
            toast({
                title: "No Image",
                description: "Please upload an image first.",
                variant: "destructive",
            });
            return;
        }

        setIsCompressing(true);
        setCompressedUrl(null);
        setCompressedSize(0);

        const img = new Image();
        img.src = originalPreview;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                toast({ title: "Error", description: "Could not get canvas context.", variant: "destructive" });
                setIsCompressing(false);
                return;
            }
            
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (blob) {
                    setCompressedSize(blob.size);
                    setCompressedUrl(URL.createObjectURL(blob));
                } else {
                     toast({ title: "Error", description: "Could not create blob from canvas.", variant: "destructive" });
                }
                setIsCompressing(false);
            }, 'image/jpeg', quality);
        };
        img.onerror = () => {
            toast({ title: "Error", description: "Could not load image for compression.", variant: "destructive" });
            setIsCompressing(false);
        }
    };

    const handleReset = () => {
        setOriginalFile(null);
        setOriginalPreview(null);
        setOriginalSize(0);
        setCompressedUrl(null);
        setCompressedSize(0);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const sizeReduction = originalSize > 0 && compressedSize > 0
        ? `-${Math.round(((originalSize - compressedSize) / originalSize) * 100)}%`
        : '';
    
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                         <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Image Compressor</CardTitle>
                        <CardDescription>Compress JPG, PNG, and WEBP images with adjustable quality.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!originalFile && (
                            <Card 
                                className="border-2 border-dashed border-muted-foreground/50 h-64 flex items-center justify-center text-center cursor-pointer hover:border-primary transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                />
                                <div className="space-y-2 text-muted-foreground">
                                    <Upload className="h-10 w-10 mx-auto" />
                                    <p>Click or drag to upload an image</p>
                                </div>
                            </Card>
                        )}
                        
                        {originalFile && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <Card className="flex flex-col items-center p-4">
                                        <CardTitle className="text-lg mb-2">Original</CardTitle>
                                        <img src={originalPreview!} alt="Original preview" className="max-h-64 rounded-md shadow-md object-contain"/>
                                        <p className="mt-2 font-semibold">{formatBytes(originalSize)}</p>
                                    </Card>
                                     <Card className="flex flex-col items-center p-4 min-h-[200px] justify-center">
                                        <CardTitle className="text-lg mb-2">Compressed</CardTitle>
                                        {isCompressing ? (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                <Loader2 className="h-10 w-10 animate-spin mb-2"/>
                                                <p>Compressing...</p>
                                            </div>
                                        ) : compressedUrl ? (
                                            <>
                                                <img src={compressedUrl} alt="Compressed preview" className="max-h-64 rounded-md shadow-md object-contain"/>
                                                <p className="mt-2 font-semibold">
                                                    {formatBytes(compressedSize)}
                                                    <span className="ml-2 text-green-600 font-bold">{sizeReduction}</span>
                                                </p>
                                            </>
                                        ) : (
                                            <div className="text-center text-muted-foreground">
                                                <p>Adjust quality and click "Compress"</p>
                                            </div>
                                        )}
                                    </Card>
                                </div>

                                <Card className="p-6 bg-muted/50">
                                    <div className="space-y-2">
                                        <Label htmlFor="quality">Compression Quality: <span className="font-bold">{(quality * 100).toFixed(0)}%</span></Label>
                                        <Slider
                                            id="quality"
                                            min={0.1}
                                            max={1}
                                            step={0.05}
                                            value={[quality]}
                                            onValueChange={(value) => setQuality(value[0])}
                                            disabled={isCompressing}
                                        />
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                                        <Button onClick={handleCompress} disabled={isCompressing} size="lg">
                                            <ImageIcon className="mr-2" /> {isCompressing ? 'Compressing...' : 'Compress Image'}
                                        </Button>
                                        {compressedUrl && (
                                            <Button asChild size="lg" variant="secondary">
                                                <a href={compressedUrl} download={`compressed-${originalFile.name}`}>
                                                    <Download className="mr-2" /> Download
                                                </a>
                                            </Button>
                                        )}
                                        <Button variant="outline" onClick={handleReset} size="lg">
                                            <RefreshCw className="mr-2" /> New Image
                                        </Button>
                                    </div>
                                </Card>
                            </>
                        )}
                    </CardContent>
                </Card>
                
                {imageCompressorGuide && (
                    <Accordion type="single" collapsible className="w-full">
                       <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{imageCompressorGuide.title}</CardTitle>
                                        <CardDescription>{imageCompressorGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {imageCompressorGuide.steps.map((step, stepIndex) => (
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
