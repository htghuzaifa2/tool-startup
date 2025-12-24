
"use client"

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Banknote, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const currencyData = {
    "USD": { "name": "United States Dollar", "rate": 1 },
    "EUR": { "name": "Euro", "rate": 0.93 },
    "JPY": { "name": "Japanese Yen", "rate": 159.82 },
    "GBP": { "name": "British Pound", "rate": 0.79 },
    "AUD": { "name": "Australian Dollar", "rate": 1.50 },
    "CAD": { "name": "Canadian Dollar", "rate": 1.37 },
    "CHF": { "name": "Swiss Franc", "rate": 0.90 },
    "CNY": { "name": "Chinese Yuan", "rate": 7.26 },
    "INR": { "name": "Indian Rupee", "rate": 83.45 },
    "BRL": { "name": "Brazilian Real", "rate": 5.45 },
    "RUB": { "name": "Russian Ruble", "rate": 87.85 },
    "PKR": { "name": "Pakistani Rupee", "rate": 278.50 },
};

type CurrencyCode = keyof typeof currencyData;

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USD");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("PKR");
  const [result, setResult] = useState<string | null>(null);
  const currencyConverterGuide = guides.find(g => g.href.includes('currency-converter'));

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

  const currencyOptions = useMemo(() => 
    Object.entries(currencyData).map(([code, { name }]) => ({
      value: code,
      label: `${code} - ${name}`
    })), 
  []);

  useEffect(() => {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) {
      setResult(null);
      return;
    }

    const rateFrom = currencyData[fromCurrency].rate;
    const rateTo = currencyData[toCurrency].rate;
    
    const amountInUsd = value / rateFrom;
    const convertedAmount = amountInUsd * rateTo;

    setResult(convertedAmount.toFixed(2));
  }, [amount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
         <Card>
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <Banknote className="w-8 h-8" />
                </div>
                <CardTitle className="text-4xl font-bold font-headline">Currency Converter</CardTitle>
                <CardDescription>Quickly convert between major world currencies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert variant="default" className="bg-yellow-50/80 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800/60 dark:text-yellow-200 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-300">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Disclaimer</AlertTitle>
                  <AlertDescription>
                    The exchange rates used are static and for demonstration only. Do not use for real financial transactions.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2">
                    <div className="w-full space-y-2">
                        <label className="text-sm font-medium">From</label>
                        <Input 
                            type="text" 
                            value={amount} 
                            onChange={handleAmountChange} 
                            className="text-lg"
                        />
                        <Select value={fromCurrency} onValueChange={(v) => setFromCurrency(v as CurrencyCode)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {currencyOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:pt-8">
                        <Button variant="ghost" size="icon" onClick={handleSwapCurrencies}>
                          <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                        </Button>
                    </div>

                    <div className="w-full space-y-2">
                        <label className="text-sm font-medium">To</label>
                        <Input type="text" value={result ?? "..."} readOnly className="text-lg font-bold bg-muted" />
                         <Select value={toCurrency} onValueChange={(v) => setToCurrency(v as CurrencyCode)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {currencyOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {result && (
                  <div className="text-center text-muted-foreground pt-4">
                      <p className="font-bold text-lg text-foreground">{`${amount} ${fromCurrency} = ${result} ${toCurrency}`}</p>
                  </div>
                )}
            </CardContent>
        </Card>

        {currencyConverterGuide && (
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                    <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                        <FancyAccordionButton />
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">{currencyConverterGuide.title}</CardTitle>
                                <CardDescription>{currencyConverterGuide.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    {currencyConverterGuide.steps.map((step, stepIndex) => (
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
