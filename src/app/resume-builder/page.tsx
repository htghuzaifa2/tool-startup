
"use client"

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, FileText, Palette, Type, AlignVerticalSpaceAround, Mail, Phone, MapPin, Settings, Maximize, Briefcase, Columns, Wand2, Code, FileSignature, BookCopy, BarChart2, X } from 'lucide-react';
import { ResumeForm, resumeSchema, type ResumeData } from '@/components/resume/form';
import { ResumeTemplate, type TemplateName } from '@/components/resume/template';
import jsPDF from 'jspdf';
import { guides } from "@/lib/search-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogHeader, DialogTitle as DialogTitleComponent } from '@/components/ui/dialog';
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import html2canvas from 'html2canvas';


const defaultValues: ResumeData = {
    fullName: 'John Doe',
    jobTitle: 'Software Engineer',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    summary: 'A passionate software engineer with 5+ years of experience in developing web applications using modern technologies. Proven ability to work in fast-paced environments and deliver high-quality code.',
    experience: [
        {
            id: '1',
            jobTitle: 'Senior Software Engineer',
            company: 'Tech Solutions Inc.',
            startDate: 'Jan 2020',
            endDate: 'Present',
            description: '- Led a team of 5 engineers to develop a new e-commerce platform.\n- Improved application performance by 30% through code optimization and database tuning.\n- Mentored junior developers and conducted code reviews.'
        },
        {
            id: '2',
            jobTitle: 'Software Engineer',
            company: 'Web Innovations',
            startDate: 'Jun 2017',
            endDate: 'Dec 2019',
            description: '- Developed and maintained front-end features for a SaaS application using React.\n- Collaborated with designers to create responsive and user-friendly interfaces.\n- Wrote unit and integration tests to ensure code quality.'
        }
    ],
    education: [
        {
            id: '1',
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of Technology',
            startDate: 'Sep 2013',
            endDate: 'May 2017',
            description: 'Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development.'
        }
    ],
    skills: 'React, TypeScript, Node.js, GraphQL, PostgreSQL, Docker, AWS',
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'A full-stack e-commerce website with features like product catalog, shopping cart, and secure checkout. Built with Next.js, Stripe, and Prisma.',
        url: 'https://example.com'
      }
    ],
    publications: [
      {
        id: '1',
        title: 'The Future of Web Development',
        journal: 'Journal of Modern Technology',
        date: '2022',
        url: 'https://example.com/publication'
      }
    ],
    photoUrl: 'https://placehold.co/400x400.png'
};


export type FontFamily = "sans" | "serif" | "mono";

const templateOptions: { name: TemplateName, label: string, description: string, icon: React.ReactNode }[] = [
    { name: "professional", label: "Professional", description: "A classic, single-column layout.", icon: <Briefcase className="w-8 h-8 text-muted-foreground" /> },
    { name: "modern", label: "Modern", description: "A two-column design with a sidebar.", icon: <Columns className="w-8 h-8 text-muted-foreground" /> },
    { name: "creative", label: "Creative", description: "A stylish layout with a sidebar photo.", icon: <Wand2 className="w-8 h-8 text-muted-foreground" /> },
    { name: "technical", label: "Technical", description: "A clean, monospace-font layout for developers.", icon: <Code className="w-8 h-8 text-muted-foreground" /> },
    { name: "classic", label: "Classic", description: "A timeless, centered-heading style.", icon: <FileSignature className="w-8 h-8 text-muted-foreground" /> },
    { name: "minimalist", label: "Minimalist", description: "Clean and focused on typography.", icon: <Type className="w-8 h-8 text-muted-foreground" /> },
    { name: "corporate", label: "Corporate", description: "A modern and professional layout.", icon: <Briefcase className="w-8 h-8 text-muted-foreground" /> },
    { name: "academic", label: "Academic", description: "A classic CV style for researchers.", icon: <BookCopy className="w-8 h-8 text-muted-foreground" /> },
    { name: "infographic", label: "Infographic", description: "A skills-focused, visual resume.", icon: <BarChart2 className="w-8 h-8 text-muted-foreground" /> },
];

export default function ResumeBuilderPage() {
    const [template, setTemplate] = useState<TemplateName>("creative");
    const [accentColor, setAccentColor] = useState("#3F51B5");
    const [fontSize, setFontSize] = useState(10);
    const [lineHeight, setLineHeight] = useState(1.5);
    const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
    
    // Visibility toggles
    const [showEmail, setShowEmail] = useState(true);
    const [showPhone, setShowPhone] = useState(true);
    const [showAddress, setShowAddress] = useState(true);
    const [showPhoto, setShowPhoto] = useState(true);
    const isMobile = useIsMobile();

    const methods = useForm<ResumeData>({
        resolver: zodResolver(resumeSchema),
        defaultValues,
    });
    const resumeBuilderGuide = guides.find(g => g.href.includes('resume-builder'));
    
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

    const handleDownloadPdf = async () => {
        const resumeElement = document.getElementById('resume-preview-fullscreen-content');
        if (!resumeElement) return;

        const canvas = await html2canvas(resumeElement, {
             useCORS: true,
             scale: 2
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('resume.pdf');
    };
    
    const editorControls = (
         <Accordion type="multiple" defaultValue={['templates', 'content']} className="w-full">
            <AccordionItem value="templates">
                <AccordionTrigger className="text-xl font-bold font-headline">Templates & Styles</AccordionTrigger>
                <AccordionContent>
                    <Card>
                         <CardHeader>
                            <CardTitle>Templates</CardTitle>
                            <CardDescription>Choose a layout that best fits your profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {templateOptions.map(t => (
                                    <button key={t.name} onClick={() => setTemplate(t.name)} className={cn('border-2 rounded-lg p-2 text-left transition-all hover:border-primary/80 hover:scale-105', template === t.name ? 'border-primary ring-2 ring-primary' : 'border-border')}>
                                        <div className="bg-muted h-28 w-full rounded-md flex items-center justify-center mb-2">
                                           {t.icon}
                                        </div>
                                        <p className="text-sm font-semibold">{t.label}</p>
                                        <p className="text-xs text-muted-foreground">{t.description}</p>
                                    </button>
                                ))}
                            </div>
                            <div className="space-y-4 pt-4">
                                <h3 className="text-lg font-semibold">Style Customization</h3>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <Label htmlFor="accent-color">Accent Color</Label>
                                        <div className="relative mt-2">
                                            <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <input id="accent-color" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-full h-10 pl-10 pr-2 rounded-md border border-input" />
                                        </div>
                                    </div>
                                     <div>
                                        <Label>Font Family</Label>
                                        <Select value={fontFamily} onValueChange={(v) => setFontFamily(v as FontFamily)}>
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select a font" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sans">Sans Serif</SelectItem>
                                                <SelectItem value="serif">Serif</SelectItem>
                                                <SelectItem value="mono">Monospace</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="font-size">Font Size ({fontSize}pt)</Label>
                                        <Slider id="font-size" min={8} max={12} step={0.5} value={[fontSize]} onValueChange={(v) => setFontSize(v[0])} className="mt-2" />
                                    </div>
                                     <div>
                                        <Label htmlFor="line-height">Line Spacing ({lineHeight.toFixed(1)})</Label>
                                        <Slider id="line-height" min={1.2} max={1.8} step={0.1} value={[lineHeight]} onValueChange={(v) => setLineHeight(v[0])} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                 <h3 className="text-lg font-semibold">Visibility</h3>
                                 <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Switch id="showEmail" checked={showEmail} onCheckedChange={setShowEmail} />
                                        <Label htmlFor="showEmail" className="flex items-center gap-1"><Mail className="w-4 h-4" /> Email</Label>
                                    </div>
                                     <div className="flex items-center space-x-2">
                                        <Switch id="showPhone" checked={showPhone} onCheckedChange={setShowPhone} />
                                        <Label htmlFor="showPhone" className="flex items-center gap-1"><Phone className="w-4 h-4" /> Phone</Label>
                                    </div>
                                     <div className="flex items-center space-x-2">
                                        <Switch id="showAddress" checked={showAddress} onCheckedChange={setShowAddress} />
                                        <Label htmlFor="showAddress" className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Address</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="showPhoto" checked={showPhoto} onCheckedChange={setShowPhoto} />
                                        <Label htmlFor="showPhoto" className="flex items-center gap-1"><FileText className="w-4 h-4" /> Photo</Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="content">
                <AccordionTrigger className="text-xl font-bold font-headline">Resume Content</AccordionTrigger>
                <AccordionContent>
                     <ResumeForm />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );

    const resumePreview = (
         <Card className="overflow-hidden sticky top-4">
             <div className="h-auto w-full bg-background shadow-lg overflow-hidden aspect-[8.5/11] relative group">
                <div className="absolute inset-0 scale-[0.25] sm:scale-[0.4] md:scale-[0.5] lg:scale-[0.35] xl:scale-[0.5] origin-top-left">
                    <ResumeTemplate 
                        template={template}
                        accentColor={accentColor}
                        fontSize={fontSize}
                        fontFamily={fontFamily}
                        lineHeight={lineHeight}
                        showEmail={showEmail}
                        showPhone={showPhone}
                        showAddress={showAddress}
                        showPhoto={showPhoto}
                    />
                </div>
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize className="w-5 h-5"/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[95vh] p-0">
                         <DialogHeader>
                            <DialogTitleComponent className="sr-only">Resume Preview</DialogTitleComponent>
                         </DialogHeader>
                         <div className="w-full h-full overflow-y-auto" >
                            <ResumeTemplate 
                                id="resume-preview-fullscreen-content"
                                template={template}
                                accentColor={accentColor}
                                fontSize={fontSize}
                                fontFamily={fontFamily}
                                lineHeight={lineHeight}
                                showEmail={showEmail}
                                showPhone={showPhone}
                                showAddress={showAddress}
                                showPhoto={showPhoto}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </Card>
    );

    return (
        <FormProvider {...methods}>
            <div className="container mx-auto py-10">
                <div className="text-center mb-12">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center mb-4">
                        <FileText className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Resume Builder</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Create and customize a professional resume in minutes.</p>
                </div>

                 <div className="grid lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_550px] gap-8 items-start">
                    <div className="space-y-6">
                        {isMobile && <div className="space-y-4">
                            <Button onClick={handleDownloadPdf} className="w-full" size="lg">
                                <Download className="mr-2" /> Download as PDF
                            </Button>
                            {resumePreview}
                        </div>}
                        {editorControls}
                    </div>
                    {!isMobile && (
                        <div className="space-y-4">
                            <Button onClick={handleDownloadPdf} className="w-full" size="lg">
                                <Download className="mr-2" /> Download as PDF
                            </Button>
                            {resumePreview}
                        </div>
                    )}
                </div>


                 {resumeBuilderGuide && (
                    <div className="mt-8">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                                <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                    <FancyAccordionButton />
                                </AccordionTrigger>
                                <AccordionContent className="pt-6 w-full">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="font-headline">{resumeBuilderGuide.title}</CardTitle>
                                            <CardDescription>{resumeBuilderGuide.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                                {resumeBuilderGuide.steps.map((step, stepIndex) => (
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
        </FormProvider>
    );
}
