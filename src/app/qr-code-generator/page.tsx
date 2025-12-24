
"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Download, QrCode, Wifi, Contact, Palette, Settings } from 'lucide-react';
import QRCode from 'qrcode';
import { useToast } from "@/hooks/use-toast";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


type QrType = 'text' | 'wifi' | 'vcard';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export default function QRCodeGeneratorPage() {
    const [qrType, setQrType] = useState<QrType>('text');
    
    // Input states
    const [text, setText] = useState('https://tool.huzi.pk');
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('WPA');
    const [vcardName, setVcardName] = useState('');
    const [vcardOrg, setVcardOrg] = useState('');
    const [vcardTitle, setVcardTitle] = useState('');
    const [vcardTel, setVcardTel] = useState('');
    const [vcardEmail, setVcardEmail] = useState('');
    const [vcardUrl, setVcardUrl] = useState('');
    
    // Customization states
    const [qrColor, setQrColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [size, setSize] =useState(256);
    const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('H');

    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const { toast } = useToast();
    const qrCodeGuide = guides.find(g => g.href.includes('qr-code-generator'));

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

    const getQrCodeValue = useCallback(() => {
        switch (qrType) {
            case 'wifi':
                return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
            case 'vcard':
                let vcardString = 'BEGIN:VCARD\nVERSION:3.0\n';
                if(vcardName) vcardString += `FN:${vcardName}\n`;
                if(vcardOrg) vcardString += `ORG:${vcardOrg}\n`;
                if(vcardTitle) vcardString += `TITLE:${vcardTitle}\n`;
                if(vcardTel) vcardString += `TEL;TYPE=WORK,VOICE:${vcardTel}\n`;
                if(vcardEmail) vcardString += `EMAIL:${vcardEmail}\n`;
                if(vcardUrl) vcardString += `URL:${vcardUrl}\n`;
                vcardString += 'END:VCARD';
                return vcardString;
            case 'text':
            default:
                return text;
        }
    }, [qrType, text, ssid, password, encryption, vcardName, vcardOrg, vcardTitle, vcardTel, vcardEmail, vcardUrl]);
    
    useEffect(() => {
        const value = getQrCodeValue();
        if (value) {
            QRCode.toDataURL(value, {
                width: size,
                margin: 2,
                errorCorrectionLevel: errorCorrection,
                color: {
                    dark: qrColor,
                    light: bgColor,
                }
            })
            .then(url => {
                setQrCodeDataUrl(url);
            })
            .catch(err => {
                console.error(err);
                 toast({ title: "Error", description: "Could not generate QR code.", variant: "destructive"});
            });
        } else {
            setQrCodeDataUrl('');
        }
    }, [getQrCodeValue, size, errorCorrection, qrColor, bgColor, toast]);

    const handleDownload = async (format: 'png' | 'svg') => {
        const value = getQrCodeValue();
        if (!value) return;

        try {
            if (format === 'png') {
                 const link = document.createElement('a');
                 link.href = qrCodeDataUrl;
                 link.download = 'qrcode.png';
                 document.body.appendChild(link);
                 link.click();
                 document.body.removeChild(link);
            } else { // svg
                const svgString = await QRCode.toString(value, {
                    type: 'svg',
                    width: size,
                    margin: 2,
                    errorCorrectionLevel: errorCorrection,
                    color: {
                        dark: qrColor,
                        light: bgColor,
                    }
                });
                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'qrcode.svg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (err) {
             console.error(err);
             toast({ title: "Download Error", description: "Failed to create download file.", variant: "destructive"});
        }
    };
    
    const inputFields = {
      'text': [
        {label: "Text or URL", value: text, setter: setText, placeholder: "https://tool.huzi.pk"},
      ],
      'wifi': [
        {label: "Network Name (SSID)", value: ssid, setter: setSsid, placeholder: "My_WiFi_Network"},
        {label: "Password", value: password, setter: setPassword, placeholder: "MySecretPassword"},
      ],
      'vcard': [
        {label: "Full Name", value: vcardName, setter: setVcardName, placeholder: "John Doe"},
        {label: "Organization", value: vcardOrg, setter: setVcardOrg, placeholder: "Doe Corp"},
        {label: "Job Title", value: vcardTitle, setter: setVcardTitle, placeholder: "CEO"},
        {label: "Phone Number", value: vcardTel, setter: setVcardTel, placeholder: "+1-202-555-0104"},
        {label: "Email", value: vcardEmail, setter: setVcardEmail, placeholder: "john.doe@example.com"},
        {label: "Website", value: vcardUrl, setter: setVcardUrl, placeholder: "www.example.com"},
      ]
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <QrCode className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">QR Code Generator</CardTitle>
                        <CardDescription>Generate customizable QR codes for text, URLs, WiFi, and more.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                            <Tabs value={qrType} onValueChange={(v) => setQrType(v as QrType)} className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="text"><QrCode className="mr-2"/>Text/URL</TabsTrigger>
                                    <TabsTrigger value="wifi"><Wifi className="mr-2"/>WiFi</TabsTrigger>
                                    <TabsTrigger value="vcard"><Contact className="mr-2"/>vCard</TabsTrigger>
                                </TabsList>
                                <TabsContent value="text" className="pt-4 space-y-4">
                                  {inputFields.text.map(field => <div key={field.label}><Label>{field.label}</Label><Input placeholder={field.placeholder} value={field.value} onChange={(e) => field.setter(e.target.value)} /></div>)}
                                </TabsContent>
                                <TabsContent value="wifi" className="pt-4 space-y-4">
                                  {inputFields.wifi.map(field => <div key={field.label}><Label>{field.label}</Label><Input placeholder={field.placeholder} value={field.value} onChange={(e) => field.setter(e.target.value)} /></div>)}
                                  <div>
                                    <Label>Encryption</Label>
                                    <Select value={encryption} onValueChange={setEncryption}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="WPA">WPA/WPA2</SelectItem>
                                            <SelectItem value="WEP">WEP</SelectItem>
                                            <SelectItem value="nopass">None</SelectItem>
                                        </SelectContent>
                                  </Select>
                                  </div>
                                </TabsContent>
                                <TabsContent value="vcard" className="pt-4 space-y-4">
                                  {inputFields.vcard.map(field => <div key={field.label}><Label>{field.label}</Label><Input placeholder={field.placeholder} value={field.value} onChange={(e) => field.setter(e.target.value)} /></div>)}
                                </TabsContent>
                            </Tabs>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    <Palette className="mr-2 inline-block h-5 w-5" />Colors
                                </AccordionTrigger>
                                <AccordionContent className="grid grid-cols-2 gap-4 pt-2">
                                  <div className="space-y-2">
                                    <Label htmlFor="qr-color">QR Code Color</Label>
                                    <Input id="qr-color" type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="h-12"/>
                                  </div>
                                   <div className="space-y-2">
                                    <Label htmlFor="bg-color">Background Color</Label>
                                    <Input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-12"/>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item-2">
                                <AccordionTrigger>
                                    <Settings className="mr-2 inline-block h-5 w-5" />Options
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  <div className="space-y-2">
                                    <Label>Size: {size}px</Label>
                                    <Input type="range" min="64" max="1024" step="8" value={size} onChange={e => setSize(Number(e.target.value))} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Error Correction</Label>
                                    <Select value={errorCorrection} onValueChange={(v) => setErrorCorrection(v as ErrorCorrectionLevel)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">Low (L)</SelectItem>
                                            <SelectItem value="M">Medium (M)</SelectItem>
                                            <SelectItem value="Q">Quartile (Q)</SelectItem>
                                            <SelectItem value="H">High (H)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                        </div>
                        <div className="space-y-4">
                           {qrCodeDataUrl && (
                                <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-muted">
                                    <div className="p-4 bg-white rounded-lg shadow-md" style={{backgroundColor: bgColor}}>
                                        <img src={qrCodeDataUrl} alt="Generated QR Code" width={256} height={256} />
                                    </div>
                                    <div className="flex gap-4">
                                        <Button onClick={() => handleDownload('png')}>
                                            <Download className="mr-2" /> Download PNG
                                        </Button>
                                        <Button onClick={() => handleDownload('svg')} variant="secondary">
                                            <Download className="mr-2" /> Download SVG
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {qrCodeGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{qrCodeGuide.title}</CardTitle>
                                        <CardDescription>{qrCodeGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {qrCodeGuide.steps.map((step, stepIndex) => (
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

    