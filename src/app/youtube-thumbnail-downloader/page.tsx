
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Youtube, Link, Download } from 'lucide-react';
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

export default function YouTubeThumbnailDownloaderPage() {
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
    const [videoId, setVideoId] = useState<string | null>(null);
    const { toast } = useToast();
    const youtubeGuide = guides.find(g => g.href.includes('youtube-thumbnail-downloader'));

    const getYouTubeVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleGetThumbnails = () => {
        const id = getYouTubeVideoId(videoUrl);
        if (id) {
            setVideoId(id);
            const qualities = [
                { quality: 'Max-Res', url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`, width: 1280, height: 720 },
                { quality: 'Standard', url: `https://img.youtube.com/vi/${id}/sddefault.jpg`, width: 640, height: 480 },
                { quality: 'High', url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`, width: 480, height: 360 },
                { quality: 'Medium', url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`, width: 320, height: 180 },
                { quality: 'Default', url: `https://img.youtube.com/vi/${id}/default.jpg`, width: 120, height: 90 },
            ];
            setThumbnails(qualities);
        } else {
            toast({
                title: "Invalid URL",
                description: "Please enter a valid YouTube video URL.",
                variant: "destructive",
            });
            setVideoId(null);
            setThumbnails([]);
        }
    };
    
    const handleDownload = async (url: string, quality: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                 throw new Error('Thumbnail not found or could not be fetched.');
            }
            
            const blob = await response.blob();
            // YouTube's placeholder for non-existent thumbnails is a small GIF.
            if (blob.type.includes('gif') || blob.size < 2000) { 
                throw new Error('This thumbnail quality may not exist for this video.');
            }

            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `youtube_thumbnail_${videoId}_${quality}.jpg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err: any) {
            console.error(err);
            toast({
                title: "Download Failed",
                description: err.message,
                variant: "destructive",
            });
        }
    };
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const card = e.currentTarget.closest('.thumbnail-card');
        if (card) {
            (card as HTMLElement).style.display = 'none';
        }
    };

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

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Youtube className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">YouTube Thumbnail Downloader</CardTitle>
                        <CardDescription>Download high-quality thumbnails from any YouTube video instantly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-grow">
                                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Enter YouTube video URL"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={handleGetThumbnails}>Get Thumbnails</Button>
                        </div>
                        
                        {thumbnails.length > 0 && (
                            <div className="space-y-8">
                                <h3 className="text-2xl font-bold text-center font-headline">Available Thumbnails</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {thumbnails.map(thumb => (
                                        <Card key={thumb.quality} className="overflow-hidden flex flex-col thumbnail-card">
                                            <CardHeader className="p-0">
                                                <div className="aspect-video bg-muted overflow-hidden">
                                                    <img 
                                                        src={thumb.url} 
                                                        alt={`${thumb.quality} thumbnail`} 
                                                        className="w-full h-full object-cover"
                                                         onError={handleImageError}
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <CardTitle className="text-lg">{thumb.quality}</CardTitle>
                                                    <CardDescription>{thumb.width} x {thumb.height}</CardDescription>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="mt-auto p-4">
                                                <Button 
                                                    className="w-full"
                                                    onClick={() => handleDownload(thumb.url, thumb.quality)}
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {youtubeGuide && (
                   <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                               <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{youtubeGuide.title}</CardTitle>
                                        <CardDescription>{youtubeGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {youtubeGuide.steps.map((step, stepIndex) => (
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
    )
}
