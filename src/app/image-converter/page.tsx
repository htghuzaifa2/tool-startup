
"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function ImageConverterPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState('png');
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const imageConverterGuide = guides.find(g => g.href.includes('image-converter'));

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
                setSelectedFile(file);
                setConvertedUrl(null);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                 toast({
                    title: "Invalid File",
                    description: "Please select an image file.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleConvert = () => {
        if (!selectedFile) return;

        setIsConverting(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const mimeType = `image/${targetFormat}`;
                    const url = canvas.toDataURL(mimeType);
                    setConvertedUrl(url);
                }
                 setIsConverting(false);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreview(null);
        setConvertedUrl(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold font-headline">Image Converter</CardTitle>
                        <CardDescription>Convert images to PNG, JPG, or WEBP format.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Card 
                            className="border-2 border-dashed border-muted-foreground/50 h-64 flex items-center justify-center text-center cursor-pointer hover:border-primary transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            {preview ? (
                                <img src={preview} alt="Preview" className="max-h-full max-w-full rounded-md object-contain" />
                            ) : (
                                <div className="space-y-2 text-muted-foreground">
                                    <Upload className="h-10 w-10 mx-auto" />
                                    <p>Click or drag to upload an image</p>
                                </div>
                            )}
                        </Card>

                        {selectedFile && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                    <div>
                                        <label className="text-sm font-medium">Convert to</label>
                                        <Select value={targetFormat} onValueChange={setTargetFormat}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="png">PNG</SelectItem>
                                                <SelectItem value="jpeg">JPG</SelectItem>
                                                <SelectItem value="webp">WEBP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button onClick={handleConvert} disabled={isConverting}>
                                        {isConverting ? 'Converting...' : 'Convert Image'}
                                    </Button>
                                </div>

                                {convertedUrl && (
                                    <div className="text-center space-y-4">
                                        <h3 className="text-lg font-semibold">Converted Image:</h3>
                                        <img src={convertedUrl} alt="Converted" className="max-h-64 mx-auto rounded-md shadow-md"/>
                                        <div className="flex justify-center gap-4">
                                            <Button asChild>
                                                <a href={convertedUrl} download={`converted.${targetFormat}`}>
                                                    <Download className="mr-2" /> Download
                                                </a>
                                            </Button>
                                             <Button variant="outline" onClick={handleReset}>
                                                <RefreshCw className="mr-2" /> Start Over
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {imageConverterGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{imageConverterGuide.title}</CardTitle>
                                        <CardDescription>{imageConverterGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {imageConverterGuide.steps.map((step, stepIndex) => (
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
