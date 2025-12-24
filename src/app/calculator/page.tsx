
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const buttonClasses = "text-2xl h-16"

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0")
  const [currentValue, setCurrentValue] = useState<string | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const calculatorGuide = guides.find(g => g.href.includes('calculator'));

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

  const handleDigitClick = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const handleOperatorClick = (nextOperator: string) => {
    const inputValue = parseFloat(display)
    
    if (currentValue === null) {
      setCurrentValue(String(inputValue))
    } else if (operator) {
      const result = performCalculation()
      setCurrentValue(String(result))
      setDisplay(String(result))
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation = (): number => {
    const prevValue = parseFloat(currentValue!)
    const inputValue = parseFloat(display)
    switch (operator) {
      case "+": return prevValue + inputValue;
      case "-": return prevValue - inputValue;
      case "*": return prevValue * inputValue;
      case "/": return prevValue / inputValue;
      default: return inputValue;
    }
  }

  const handleEqualsClick = () => {
    if (operator && currentValue !== null) {
      const result = performCalculation()
      setDisplay(String(result))
      setCurrentValue(null)
      setOperator(null)
      setWaitingForOperand(false)
    }
  }

  const handleClearClick = () => {
    setDisplay("0")
    setCurrentValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }
  
  const handleDecimalClick = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }

  const handleToggleSignClick = () => {
    setDisplay(String(parseFloat(display) * -1))
  }

  const handlePercentageClick = () => {
    setDisplay(String(parseFloat(display) / 100))
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline">Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Your trusty companion for quick calculations.
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="bg-muted text-right p-4 rounded-lg mb-4">
              <p className="text-4xl font-mono font-bold text-foreground break-all">{display}</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="secondary" className={buttonClasses} onClick={handleClearClick}>AC</Button>
              <Button variant="secondary" className={buttonClasses} onClick={handleToggleSignClick}>+/-</Button>
              <Button variant="secondary" className={buttonClasses} onClick={handlePercentageClick}>%</Button>
              <Button variant="destructive" className={buttonClasses} onClick={() => handleOperatorClick("/")}>÷</Button>

              <Button variant="outline" className={buttonClasses} onClick={() => handleDigitClick("7")}>7</Button>
              <Button variant="outline" className={buttonClasses} onClick={() => handleDigitClick("8")}>8</Button>
              <Button variant="outline" className={buttonClasses} onClick={() => handleDigitClick("9")}>9</Button>
              <Button variant="destructive" className={buttonClasses} onClick={() => handleOperatorClick("*")}>×</Button>
              
              <Button variant="outline" className={buttonClasses} onClick={() => handleDigitClick("4")}>4</Button>
              <Button variant="outline" className={buttonClasses} onClick={() => handleDigitClick("5")}>5</Button>
              <Button variant="outline" className={buttonClasses} onClick={() => handleDigitClick("6")}>6</Button>
              <Button variant="destructive" className={buttonClasses} onClick={() => handleOperatorClick("-")}>-</Button>

              <Button variant="outline" className={buttonClasses} onClick={() => handleDigitClick("1")}>1</Button>
              <Button variant="outline" className={buttonClasses} onClick={() => handleDigitClick("2")}>2</Button>
              <Button variant="outline" className={buttonClasses} onClick={() => handleDigitClick("3")}>3</Button>
              <Button variant="destructive" className={buttonClasses} onClick={() => handleOperatorClick("+")}>+</Button>

              <Button variant="outline" className={`${buttonClasses} col-span-2`} onClick={() => handleDigitClick("0")}>0</Button>
              <Button variant="outline" className={buttonClasses} onClick={handleDecimalClick}>.</Button>
              <Button className={buttonClasses} onClick={handleEqualsClick}>=</Button>
            </div>
          </CardContent>
        </Card>

        {calculatorGuide && (
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                    <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                        <FancyAccordionButton />
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">{calculatorGuide.title}</CardTitle>
                                <CardDescription>{calculatorGuide.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    {calculatorGuide.steps.map((step, stepIndex) => (
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
