
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Link, Download, Video, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


type Thumbnail = {
    quality: string;
    url: string;
    width?: number;
    height?: number;
};

export default function VimeoThumbnailDownloaderPage() {
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnail, setThumbnail] = useState<Thumbnail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const vimeoGuide = guides.find(g => g.href.includes('vimeo-thumbnail-downloader'));

    const handleGuideClick = () => {
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80;
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    };

    const handleGetThumbnail = async () => {
        if (!videoUrl) {
            toast({
                title: "Invalid URL",
                description: "Please enter a valid Vimeo video URL.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setThumbnail(null);

        try {
            const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`;
            const response = await fetch(oembedUrl);
            
            if (!response.ok) {
                 throw new Error(`Could not fetch data from Vimeo. Please check the URL.`);
            }
            
            const data = await response.json();
            
            if (data.thumbnail_url) {
                const highResUrl = data.thumbnail_url.replace(/_(\d+)\.jpg$/, '_1920.jpg');
                setThumbnail({
                    quality: 'High Quality',
                    url: highResUrl,
                    width: data.width,
                    height: data.height,
                });
            } else {
                 throw new Error(`Thumbnail not found for this Vimeo video.`);
            }

        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || `Failed to fetch thumbnail. The URL may be incorrect or the video private.`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleDownload = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Could not fetch image for download. The thumbnail quality may not exist.');
            }
            
            const blob = await response.blob();
            if (blob.type.includes('html') || !blob.type.startsWith('image')) {
                throw new Error('Received an invalid file instead of an image. The thumbnail may not exist.');
            }

            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `vimeo_thumbnail.jpg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch(err: any) {
             toast({
                title: "Download Failed",
                description: err.message,
                variant: "destructive",
            });
        }
    }
    
    const handleImageError = () => {
        toast({
            title: "Thumbnail not found",
            description: "Could not load the thumbnail. This resolution may not exist for this video.",
            variant: "destructive"
        });
        setThumbnail(null);
    }

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8">
                 <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Video className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">Vimeo Thumbnail Downloader</CardTitle>
                        <CardDescription>Download the thumbnail from any public Vimeo video.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-grow">
                                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Enter Vimeo video URL"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={handleGetThumbnail} disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Fetching...</> : 'Get Thumbnail'}
                            </Button>
                        </div>
                    </CardContent>
                     {thumbnail && (
                        <CardFooter className="flex justify-center">
                            <Card key={thumbnail.quality} className="overflow-hidden flex flex-col max-w-sm">
                                <CardHeader className="p-0">
                                    <div className="aspect-video bg-muted overflow-hidden">
                                        <img src={thumbnail.url} alt={`${thumbnail.quality} thumbnail`} className="w-full h-full object-cover" onError={handleImageError} />
                                    </div>
                                    <div className="p-4">
                                        <CardTitle className="text-lg">{thumbnail.quality}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardFooter className="p-4 mt-auto">
                                    <Button className="w-full" onClick={() => handleDownload(thumbnail.url)}>
                                        <Download className="mr-2 h-4 w-4" /> Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        </CardFooter>
                    )}
                </Card>

                {vimeoGuide && (
                   <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                               <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{vimeoGuide.title}</CardTitle>
                                        <CardDescription>{vimeoGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {vimeoGuide.steps.map((step, stepIndex) => (
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
