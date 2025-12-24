
"use client"

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, RefreshCw, FileText, X, Loader2, Merge, GripVertical } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from 'pdf-lib';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


type PdfFile = {
    id: number;
    file: File;
    name: string;
};

export default function PdfMergerPage() {
    const [files, setFiles] = useState<PdfFile[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const { toast } = useToast();
    const pdfMergerGuide = guides.find(g => g.href.includes('pdf-merger'));

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
        let selectedFiles: FileList | null = null;
        if ('dataTransfer' in e) {
            e.preventDefault();
            e.stopPropagation();
            selectedFiles = e.dataTransfer.files;
        } else {
            selectedFiles = e.target.files;
        }

        if (selectedFiles) {
            const pdfFiles = Array.from(selectedFiles).filter(file => file.type === 'application/pdf');
            if (pdfFiles.length !== selectedFiles.length) {
                toast({
                    title: "Invalid Files",
                    description: "Some selected files were not PDFs and have been ignored.",
                    variant: "destructive",
                });
            }
            const newFiles: PdfFile[] = pdfFiles.map(file => ({
                id: Date.now() + Math.random(),
                file,
                name: file.name
            }));
            setFiles(prev => [...prev, ...newFiles]);
        }
    };
    
    const handleMerge = async () => {
        if (files.length < 2) {
            toast({
                title: "Not Enough Files",
                description: "Please select at least two PDF files to merge.",
                variant: "destructive",
            });
            return;
        }

        setIsMerging(true);
        toast({ title: 'Merging Started', description: 'Your PDF is being generated...' });

        try {
            const mergedPdf = await PDFDocument.create();
            for (const { file } of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            
            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `merged-document-${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            toast({ title: 'Success!', description: 'Your merged PDF has been downloaded.' });
        } catch (error) {
            console.error(error);
            toast({
                title: "Merge Failed",
                description: "Something went wrong while merging the PDFs. Some files may be corrupted or protected.",
                variant: "destructive",
            });
        } finally {
            setIsMerging(false);
        }
    };

    const handleReset = () => {
        setFiles([]);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    const removeFile = (id: number) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleDragSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const newFiles = [...files];
        const draggedItemContent = newFiles.splice(dragItem.current, 1)[0];
        newFiles.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setFiles(newFiles);
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Merge className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">PDF Merger</CardTitle>
                        <CardDescription>Combine multiple PDF files into one single document.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                                multiple
                            />
                            <div className="space-y-2 text-muted-foreground">
                                <Upload className="h-10 w-10 mx-auto" />
                                <p>Click or drag & drop to upload PDFs</p>
                                <p className="text-xs">Multiple files accepted</p>
                            </div>
                        </Card>

                        {files.length > 0 && (
                            <div className="space-y-4">
                               <h3 className="text-lg font-semibold text-center">File Queue ({files.length}) - Drag to reorder</h3>
                               <div className="space-y-2 max-h-96 overflow-y-auto p-2 bg-muted rounded-md">
                                   {files.map((item, index) => (
                                       <div 
                                         key={item.id} 
                                         className="flex items-center bg-background p-2 rounded-md shadow-sm"
                                         draggable
                                         onDragStart={() => dragItem.current = index}
                                         onDragEnter={() => dragOverItem.current = index}
                                         onDragEnd={handleDragSort}
                                         onDragOver={(e) => e.preventDefault()}
                                       >
                                            <GripVertical className="h-5 w-5 mr-2 text-muted-foreground cursor-grab"/>
                                            <FileText className="h-5 w-5 mr-3 text-primary"/>
                                            <p className="flex-1 truncate">{item.name}</p>
                                            <Button variant="ghost" size="icon" onClick={() => removeFile(item.id)}>
                                                <X className="h-4 w-4 text-destructive" />
                                            </Button>
                                       </div>
                                   ))}
                               </div>
                               
                               <div className="flex justify-center gap-4">
                                   <Button onClick={handleMerge} disabled={isMerging || files.length < 2} size="lg">
                                       {isMerging ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Merging...</> : <><Merge className="mr-2" /> Merge PDFs</>}
                                   </Button>
                                   <Button variant="outline" onClick={handleReset} size="lg">
                                       <RefreshCw className="mr-2" /> Clear All
                                   </Button>
                               </div>
                           </div>
                        )}
                    </CardContent>
                </Card>

                {pdfMergerGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{pdfMergerGuide.title}</CardTitle>
                                        <CardDescription>{pdfMergerGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {pdfMergerGuide.steps.map((step, stepIndex) => (
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
