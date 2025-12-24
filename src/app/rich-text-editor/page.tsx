
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Pilcrow } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


export default function RichTextEditorPage() {
  const richTextEditorGuide = guides.find(g => g.href.includes('rich-text-editor'));
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
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <Pilcrow className="w-8 h-8" />
                </div>
                <CardTitle className="text-4xl font-bold font-headline">Rich Text Editor</CardTitle>
                <CardDescription>An advanced editor for all your formatting needs. Content is saved locally.</CardDescription>
            </CardHeader>
            <CardContent>
                <RichTextEditor />
            </CardContent>
        </Card>

        {richTextEditorGuide && (
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                    <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                        <FancyAccordionButton />
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">{richTextEditorGuide.title}</CardTitle>
                                <CardDescription>{richTextEditorGuide.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    {richTextEditorGuide.steps.map((step, stepIndex) => (
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
