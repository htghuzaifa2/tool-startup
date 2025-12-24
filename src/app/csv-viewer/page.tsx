
"use client"

import { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Upload, Sheet, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function CsvViewerPage() {
    const [data, setData] = useState<Record<string, any>[]>([]);
    const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const csvViewerGuide = guides.find(g => g.href.includes('csv-viewer'));

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
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        const parsedData = result.data as Record<string, any>[];
                        setData(parsedData);
                        
                        if(parsedData.length > 0) {
                            const columnDefs: ColumnDef<any>[] = Object.keys(parsedData[0]).map((key) => ({
                                accessorKey: key,
                                header: ({ column }) => (
                                     <Button
                                        variant="ghost"
                                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                    >
                                        {key}
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                ),
                            }));
                            setColumns(columnDefs);
                        }

                        toast({
                            title: "CSV Loaded",
                            description: `Successfully parsed ${parsedData.length} rows.`,
                        })
                    },
                    error: (error: any) => {
                         toast({
                            title: "Parsing Error",
                            description: error.message,
                            variant: "destructive",
                        });
                    }
                });
            } else {
                 toast({
                    title: "Invalid File",
                    description: "Please select a valid CSV file.",
                    variant: "destructive",
                });
            }
        }
    };
    
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-7xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                           <Sheet className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">CSV Viewer</CardTitle>
                        <CardDescription>Upload a CSV file and view it in a clean, sortable, and searchable table.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {data.length === 0 ? (
                             <Card 
                                className="border-2 border-dashed border-muted-foreground/50 h-64 flex items-center justify-center text-center cursor-pointer hover:border-primary transition-colors"
                                onClick={handleUploadClick}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".csv, text/csv"
                                    className="hidden"
                                />
                                <div className="space-y-2 text-muted-foreground">
                                    <Upload className="h-10 w-10 mx-auto" />
                                    <p>Click or drag to upload a CSV file</p>
                                </div>
                            </Card>
                        ) : (
                            <div className="w-full space-y-4">
                                <div className="flex justify-between items-center">
                                    <Input
                                        placeholder="Search all columns..."
                                        value={globalFilter}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="max-w-sm"
                                    />
                                    <Button onClick={handleUploadClick}>Upload Another File</Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".csv, text/csv"
                                        className="hidden"
                                    />
                                </div>
                                <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(header => (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                              )}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map(row => (
                                                <TableRow key={row.id}>
                                                    {row.getVisibleCells().map(cell => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                    No results.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                </div>
                                <div className="flex items-center justify-end space-x-2 py-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => table.previousPage()}
                                      disabled={!table.getCanPreviousPage()}
                                    >
                                      <ChevronLeft className="h-4 w-4" />
                                      Previous
                                    </Button>
                                    <span className="text-sm">
                                      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => table.nextPage()}
                                      disabled={!table.getCanNextPage()}
                                    >
                                      Next
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {csvViewerGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{csvViewerGuide.title}</CardTitle>
                                        <CardDescription>{csvViewerGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {csvViewerGuide.steps.map((step, stepIndex) => (
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
