
"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Copy, CaseSensitive } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};

const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
};

const invertCase = (str: string) => {
    return str.split('').map(char => {
        if (char >= 'A' && char <= 'Z') {
            return char.toLowerCase();
        } else if (char >= 'a' && char <= 'z') {
            return char.toUpperCase();
        }
        return char;
    }).join('');
};

export default function TextToolsPage() {
  const [text, setText] = useState("Hello World! This is an example sentence.")
  const { toast } = useToast();
  const textToolsGuide = guides.find(g => g.href.includes('text-tools'));

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

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
    const characters = text.length;
    const sentences = trimmedText ? (trimmedText.match(/[.!?]+(?:\s|$)/g) || []).length : 0;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    return { words, characters, sentences, paragraphs };
  }, [text]);

  const copyToClipboard = () => {
        if (!text) {
            toast({
                title: "Nothing to Copy",
                variant: "destructive"
            });
            return;
        }
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Text copied to clipboard.",
        });
    };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <CaseSensitive className="w-8 h-8" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Text Manipulation Tools</h1>
          <p className="text-muted-foreground mt-2">
            A versatile set of tools to convert, count, and analyze your text.
          </p>
        </div>

        <Tabs defaultValue="case-converter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="case-converter">Case Converter</TabsTrigger>
            <TabsTrigger value="counter">Counter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="case-converter">
            <Card>
               <CardHeader>
                    <CardTitle>Case Converter</CardTitle>
                    <CardDescription>Convert your text to various case formats.</CardDescription>
                </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter text to convert..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[250px] text-base"
                />
                <div className="flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => setText(text.toUpperCase())}>Uppercase</Button>
                        <Button onClick={() => setText(text.toLowerCase())}>Lowercase</Button>
                        <Button onClick={() => setText(toTitleCase(text))}>Title Case</Button>
                        <Button onClick={() => setText(toSentenceCase(text))}>Sentence Case</Button>
                        <Button onClick={() => setText(invertCase(text))}>Invert Case</Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard}><Copy className="h-5 w-5"/></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="counter">
             <Card>
              <CardHeader>
                <CardTitle>Text Counter</CardTitle>
                 <CardDescription>Analyze your text for word, character, and line counts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter text to analyze..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[250px] text-base"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold">{stats.words}</CardTitle>
                            <p className="text-muted-foreground">Words</p>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold">{stats.characters}</CardTitle>
                            <p className="text-muted-foreground">Characters</p>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold">{stats.sentences}</CardTitle>
                            <p className="text-muted-foreground">Sentences</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold">{stats.paragraphs}</CardTitle>
                            <p className="text-muted-foreground">Paragraphs</p>
                        </CardHeader>
                    </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {textToolsGuide && (
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                    <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                        <FancyAccordionButton />
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">{textToolsGuide.title}</CardTitle>
                                <CardDescription>{textToolsGuide.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    {textToolsGuide.steps.map((step, stepIndex) => (
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
