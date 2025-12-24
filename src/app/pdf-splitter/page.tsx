
"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, RefreshCw, FileText, Loader2, Split } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function PdfSplitterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [ranges, setRanges] = useState<string>('');
    const [isSplitting, setIsSplitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const pdfSplitterGuide = guides.find(g => g.href.includes('pdf-splitter'));

    const handleGuideClick = () => {
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80;
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
        let selectedFile: File | null = null;
        if ('dataTransfer' in e) {
            e.preventDefault();
            e.stopPropagation();
            selectedFile = e.dataTransfer.files?.[0] || null;
        } else {
            selectedFile = e.target.files?.[0] || null;
        }

        if (selectedFile && selectedFile.type === 'application/pdf') {
            handleReset();
            setFile(selectedFile);
            try {
                const pdfBytes = await selectedFile.arrayBuffer();
                const pdfDoc = await PDFDocument.load(pdfBytes);
                setPageCount(pdfDoc.getPageCount());
                setRanges(`1-${pdfDoc.getPageCount()}`);
            } catch (error) {
                toast({
                    title: "Error Reading PDF",
                    description: "Could not read the provided PDF file. It might be corrupted.",
                    variant: "destructive",
                });
                handleReset();
            }
        } else if(selectedFile) {
            toast({
                title: "Invalid File",
                description: "Please select a valid PDF file.",
                variant: "destructive",
            });
        }
    };

    const handleSplit = async () => {
        if (!file || !ranges.trim()) {
            toast({
                title: "Missing Information",
                description: "Please upload a file and specify page ranges.",
                variant: "destructive",
            });
            return;
        }
        
        setIsSplitting(true);
        toast({ title: 'Splitting Started', description: 'Your PDF is being processed...' });

        try {
            const originalPdfBytes = await file.arrayBuffer();
            const originalPdf = await PDFDocument.load(originalPdfBytes);
            const totalPages = originalPdf.getPageCount();
            
            // Parse ranges: "1-3, 5, 8-10" -> [[1,3], [5,5], [8,10]]
            const pageRanges = ranges.split(',').map(rangeStr => {
                const parts = rangeStr.trim().split('-').map(p => parseInt(p, 10));
                if (parts.length === 1 && !isNaN(parts[0])) return [parts[0], parts[0]];
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return parts;
                return null;
            }).filter(r => r !== null) as [number, number][];

            if (pageRanges.length === 0) {
                throw new Error("Invalid page ranges provided. Please use a format like '1-3, 5, 8-10'.");
            }

            const zip = new JSZip();

            for (let i = 0; i < pageRanges.length; i++) {
                const [start, end] = pageRanges[i];
                if (start > end || start < 1 || end > totalPages) {
                     throw new Error(`Invalid page range found: ${start}-${end}. All pages must be between 1 and ${totalPages}.`);
                }

                const newPdf = await PDFDocument.create();
                const pageIndices = Array.from({ length: end - start + 1 }, (_, k) => start + k - 1);
                
                const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
                copiedPages.forEach(page => newPdf.addPage(page));

                const newPdfBytes = await newPdf.save();
                zip.file(`split_pages_${start}-${end}.pdf`, newPdfBytes);
            }
            
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `${file.name.replace('.pdf', '')}_split.zip`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(link.href);

            toast({ title: 'Success!', description: 'Your split PDFs have been downloaded as a ZIP file.' });

        } catch (error: any) {
            console.error(error);
            toast({
                title: "Split Failed",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsSplitting(false);
        }
    };
    
    const handleReset = () => {
        setFile(null);
        setPageCount(0);
        setRanges('');
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Split className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">PDF Splitter</CardTitle>
                        <CardDescription>Split a single PDF into multiple documents by page range.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!file ? (
                            <Card 
                                className="border-2 border-dashed border-muted-foreground/50 h-48 flex items-center justify-center text-center cursor-pointer hover:border-primary transition-colors"
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
                                <div className="space-y-2 text-muted-foreground">
                                    <Upload className="h-10 w-10 mx-auto" />
                                    <p>Click or drag & drop a PDF to split</p>
                                </div>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                               <Card className="p-4 flex items-center justify-between bg-muted">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-6 w-6 text-primary"/>
                                        <div>
                                            <p className="font-semibold truncate">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">{pageCount} pages</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={handleReset}>
                                        <RefreshCw className="h-5 w-5"/>
                                    </Button>
                                </Card>

                                <div className="space-y-2">
                                    <Label htmlFor="ranges">Page ranges to extract</Label>
                                    <Input 
                                        id="ranges"
                                        value={ranges}
                                        onChange={(e) => setRanges(e.target.value)}
                                        placeholder="e.g., 1-3, 5, 8-10"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Use commas to separate ranges. Each range creates a new PDF.
                                    </p>
                                </div>
                               
                               <div className="text-center">
                                   <Button onClick={handleSplit} disabled={isSplitting} size="lg">
                                       {isSplitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Splitting...</> : <><Split className="mr-2" /> Split & Download ZIP</>}
                                   </Button>
                               </div>
                           </div>
                        )}
                    </CardContent>
                </Card>

                {pdfSplitterGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{pdfSplitterGuide.title}</CardTitle>
                                        <CardDescription>{pdfSplitterGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {pdfSplitterGuide.steps.map((step, stepIndex) => (
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
