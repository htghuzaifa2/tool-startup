
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRightLeft, Ruler } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


type Category = "length" | "mass" | "temperature";

const units = {
  length: { meters: "Meters", kilometers: "Kilometers", miles: "Miles", feet: "Feet", inches: "Inches", yards: "Yards" },
  mass: { kilograms: "Kilograms", grams: "Grams", pounds: "Pounds", ounces: "Ounces", stones: "Stones" },
  temperature: { celsius: "Celsius", fahrenheit: "Fahrenheit", kelvin: "Kelvin" },
};

const conversionFactors: Record<string, number> = {
  // Length to meters
  meters: 1,
  kilometers: 1000,
  miles: 1609.34,
  feet: 0.3048,
  inches: 0.0254,
  yards: 0.9144,
  // Mass to kilograms
  kilograms: 1,
  grams: 0.001,
  pounds: 0.453592,
  ounces: 0.0283495,
  stones: 6.35029,
};

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("meters");
  const [toUnit, setToUnit] = useState("feet");
  const [inputValue, setInputValue] = useState("1");
  const [result, setResult] = useState("");
  const unitConverterGuide = guides.find(g => g.href.includes('unit-converter'));

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

  useEffect(() => {
    const currentUnits = units[category];
    const unitKeys = Object.keys(currentUnits);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1]);
    setInputValue("1");
  }, [category]);

  useEffect(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("");
      return;
    }

    let output;
    if (category === "temperature") {
      let tempInCelsius: number;
      if (fromUnit === "celsius") tempInCelsius = value;
      else if (fromUnit === "fahrenheit") tempInCelsius = (value - 32) * 5/9;
      else tempInCelsius = value - 273.15; // Kelvin

      if (toUnit === "celsius") output = tempInCelsius;
      else if (toUnit === "fahrenheit") output = (tempInCelsius * 9/5) + 32;
      else output = tempInCelsius + 273.15; // Kelvin
    } else {
      const valueInBase = value * conversionFactors[fromUnit];
      output = valueInBase / conversionFactors[toUnit];
    }
    
    setResult(Number(output.toFixed(5)).toString());
  }, [inputValue, fromUnit, toUnit, category]);

  const handleInputChange = (value: string) => {
    const regex = category === 'temperature' ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setInputValue(value);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center mb-8">
           <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Ruler className="w-8 h-8" />
            </div>
          <h1 className="text-4xl font-bold font-headline">Unit Converter</h1>
          <p className="text-muted-foreground mt-2">
            Quickly convert between different units of measurement.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="w-full">
              <label className="text-sm font-medium">Category</label>
              <Select onValueChange={(v) => setCategory(v as Category)} defaultValue={category}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="length">Length</SelectItem>
                  <SelectItem value="mass">Mass</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2">
              <div className="w-full space-y-2">
                 <label className="text-sm font-medium">From</label>
                 <Input type="text" value={inputValue} onChange={(e) => handleInputChange(e.target.value)} className="text-lg" />
                 <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {Object.entries(units[category]).map(([key, name]) => (
                        <SelectItem key={key} value={key}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>

              <div className="pt-8">
                <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
              </div>

              <div className="w-full space-y-2">
                <label className="text-sm font-medium">To</label>
                <Input type="text" value={result} readOnly className="text-lg font-bold bg-muted" />
                <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {Object.entries(units[category]).map(([key, name]) => (
                        <SelectItem key={key} value={key}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {unitConverterGuide && (
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                    <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                        <FancyAccordionButton />
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">{unitConverterGuide.title}</CardTitle>
                                <CardDescription>{unitConverterGuide.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    {unitConverterGuide.steps.map((step, stepIndex) => (
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
