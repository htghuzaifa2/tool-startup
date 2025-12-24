
"use client"

import * as React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Loader2, BookOpen, ChevronLeft, ChevronRight, Download, Maximize, FileText, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import HTMLFlipBook from 'react-pageflip';
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogTitleComponent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import JSZip from 'jszip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// Set up the worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;


const Page = React.forwardRef<HTMLDivElement, { pageNumber: number, children: React.ReactNode }>(({ pageNumber, children }, ref) => {
    return (
      <div ref={ref} className="bg-background shadow-md flex items-center justify-center" data-density="hard">
        <div className="flex flex-col items-center justify-center w-full h-full">
            {children}
            <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">{pageNumber + 1}</span>
        </div>
      </div>
    );
});
Page.displayName = "Page";

export default function FlipbookMakerPage() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pages, setPages] = useState<string[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const flipBook = useRef<any>(null);
    const { toast } = useToast();
    const flipbookGuide = guides.find(g => g.href.includes('flipbook-maker'));
    const [bookDimensions, setBookDimensions] = useState({ width: 500, height: 700 }); 
    const isMobile = useIsMobile();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(0);

    const handleGuideClick = () => {
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80; // a little space from the top
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    };
    
    useEffect(() => {
      const page = searchParams.get('page');
      const pageNumber = page ? parseInt(page, 10) - 1 : 0;
      if (!isNaN(pageNumber) && pageNumber >= 0) {
        setCurrentPage(pageNumber);
        if (flipBook.current && flipBook.current.pageFlip()) {
          flipBook.current.pageFlip().turnToPage(pageNumber);
        }
      }
    }, [searchParams]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
        let file: File | null = null;
        if ('dataTransfer' in e) {
            e.preventDefault();
            e.stopPropagation();
            file = e.dataTransfer.files?.[0] || null;
        } else {
            file = e.target.files?.[0] || null;
        }

        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
            handleConvert(file);
        } else if(file) {
            toast({
                title: "Invalid File",
                description: "Please select a valid PDF file.",
                variant: "destructive",
            });
        }
    };

    const handleConvert = useCallback(async (file: File) => {
        if (!file) {
             toast({ title: "No PDF file selected", variant: "destructive"});
             return;
        }

        setIsConverting(true);
        setPages([]);
        setProgress(0);
        toast({ title: "Conversion Started", description: "Your PDF is being converted to a flipbook." });

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            const newPages: string[] = [];

            const firstPage = await pdf.getPage(1);
            const firstViewport = firstPage.getViewport({ scale: 1 });
            setBookDimensions({width: firstViewport.width, height: firstViewport.height});

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if(context){
                    const renderContext = { canvasContext: context, viewport: viewport };
                    await page.render(renderContext).promise;
                    newPages.push(canvas.toDataURL('image/jpeg', 0.9));
                }
                setProgress(((i / numPages) * 100));
            }

            setPages(newPages);
            toast({ title: "Success!", description: "Your flipbook is ready."});
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Conversion Failed",
                description: error.message || "An unexpected error occurred while processing the PDF.",
                variant: "destructive",
            });
        } finally {
            setIsConverting(false);
        }
    }, [toast]);
    
     const handleDownload = async () => {
        if (pages.length === 0) {
            toast({ title: "No pages to download", variant: "destructive" });
            return;
        }

        toast({ title: "Download Started", description: `Preparing your file(s)...` });

        if (pages.length === 1) {
            const link = document.createElement('a');
            link.href = pages[0];
            link.download = 'page_1.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const zip = new JSZip();
            pages.forEach((pageData, index) => {
                const base64Data = pageData.split(',')[1];
                zip.file(`page_${index + 1}.jpg`, base64Data, { base64: true });
            });

            zip.generateAsync({ type: "blob" }).then(zipBlob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(zipBlob);
                link.download = 'flipbook-pages.zip';
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
            });
        }
    };
    
    const handleDownloadPdf = async () => {
        const flipbookElement = document.getElementById('fullscreen-content');
        if (!flipbookElement) return;

        const canvas = await html2canvas(flipbookElement, {
             useCORS: true,
             scale: 2
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: [canvas.width, canvas.height],
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('flipbook.pdf');
    };

    const handleFlip = (e: { data: number }) => {
        const newPage = e.data + 1;
        setCurrentPage(e.data);
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('page', String(newPage));
        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.push(`${pathname}${query}`);
    };

    const renderFlipbook = (isFullScreen = false) => {
        const usePortraitMode = isMobile || (isFullScreen && window.innerWidth < 768);
        
        return (
            <HTMLFlipBook
                width={bookDimensions.width}
                height={bookDimensions.height}
                size="stretch"
                minWidth={300}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1500}
                maxShadowOpacity={0.5}
                usePortrait={usePortraitMode}
                showCover={true}
                mobileScrollSupport={true}
                ref={flipBook}
                className="mx-auto"
                onFlip={handleFlip}
                startPage={currentPage}
            >
                {pages.map((page, index) => (
                    <Page key={index} pageNumber={index}>
                        <img src={page} alt={`Page ${index + 1}`} className="w-full h-full object-contain" />
                    </Page>
                ))}
            </HTMLFlipBook>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                 <div className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-4xl font-bold font-headline">Flipbook Maker</CardTitle>
                    <CardDescription className="max-w-2xl mx-auto mt-2">
                        Convert a PDF into an interactive flipbook. Share, download, or embed to create outstanding magazines, catalogs, brochures, and more.
                    </CardDescription>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Upload Your PDF</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!pdfFile ? (
                            <div 
                                className="border-2 border-dashed border-muted-foreground/50 h-48 flex items-center justify-center text-center cursor-pointer hover:border-primary transition-colors flex-col"
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleFileChange}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="application/pdf"
                                    className="hidden"
                                />
                                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                                <p className="font-semibold">Drag & drop or click to upload PDF</p>
                                <p className="text-sm text-muted-foreground">Your file stays on your device.</p>
                            </div>
                        ) : (
                             <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <FileText className="h-8 w-8 text-primary" />
                                    <div className='flex-1'>
                                        <p className="font-semibold truncate">{pdfFile.name}</p>
                                        <p className="text-sm text-muted-foreground">{pages.length > 0 ? `${pages.length} pages` : 'Analyzing...'}</p>
                                    </div>
                                </div>
                                {isConverting && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground text-center">Converting... {Math.round(progress)}%</p>
                                        <Progress value={progress} />
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {pages.length > 0 && (
                    <Card>
                         <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl">Your Flipbook</CardTitle>
                            <div className="flex items-center gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Maximize className="mr-2 w-4 h-4"/> Fullscreen
                                        </Button>
                                    </DialogTrigger>
                                     <DialogContent className={cn("max-w-[95vw] h-[95vh] flex flex-col items-center justify-center p-0", isMobile ? "bg-background" : "bg-background/80 backdrop-blur-sm")}>
                                        <DialogHeader>
                                            <DialogTitleComponent className="sr-only">Full-screen Preview</DialogTitleComponent>
                                        </DialogHeader>
                                        <div className="w-full h-full flex items-center justify-center" id="fullscreen-content">
                                            {renderFlipbook(true)}
                                        </div>
                                         <DialogClose asChild>
                                             <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Close</span>
                                            </Button>
                                        </DialogClose>
                                    </DialogContent>
                                </Dialog>
                                <Button onClick={handleDownload} variant="secondary" size="sm"><Download className="mr-2 w-4 h-4"/> Download Pages</Button>
                            </div>
                         </CardHeader>
                         <CardContent>
                             <div className={cn("w-full bg-muted rounded-md flex items-center justify-center relative group p-4 min-h-[70vh]")}>
                                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                    {renderFlipbook(false)}
                                </div>
                             </div>
                             <div className="flex items-center justify-center gap-2 mt-4">
                                <Button variant="outline" size="icon" onClick={() => flipBook.current?.pageFlip().flipPrev()}>
                                    <ChevronLeft />
                                </Button>
                                <p className="text-sm text-muted-foreground">Page Turn</p>
                                <Button variant="outline" size="icon" onClick={() => flipBook.current?.pageFlip().flipNext()}>
                                    <ChevronRight />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                 {isConverting && !pages.length && (
                    <div className="text-center py-10">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto"/>
                        <p className="mt-4 text-muted-foreground">Processing your PDF...</p>
                    </div>
                )}
            </div>

            {flipbookGuide && (
                <div className="mt-12 max-w-4xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{flipbookGuide.title}</CardTitle>
                                        <CardDescription>{flipbookGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {flipbookGuide.steps.map((step, stepIndex) => (
                                                <li key={stepIndex}>{step}</li>
                                            ))}
                                        </ol>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
        </div>
    );
}
