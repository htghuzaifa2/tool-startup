import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb } from "lucide-react";

interface ToolGuideProps {
  title: string;
  steps: string[];
}

export function ToolGuide({ title, steps }: ToolGuideProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <Card className="mt-12" id="guide-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          How to Use {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Step-by-Step Guide</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                {steps.map((step, index) => (
                  <li key={index} className="leading-relaxed">
                    <span className="font-medium text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
