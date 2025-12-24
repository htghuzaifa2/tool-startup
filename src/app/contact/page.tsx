
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { User, Mail, MessageSquare, PenSquare, AtSign } from "lucide-react";


export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0 || message.trim().length === 0) {
      toast({
        title: "Validation Error",
        description: "Name and message fields cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const whatsappNumber = "923251480148";
    let formattedMessage = `*Contact Form Submission*\n\n`;
    formattedMessage += `*Name:*\n${name}\n\n`;
    if (email) {
      formattedMessage += `*Email:*\n${email}\n\n`;
    }
    if (subject) {
      formattedMessage += `*Subject:*\n${subject}\n\n`;
    }
    formattedMessage += `*Message:*\n${message}`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      formattedMessage
    )}`;

    window.open(whatsappUrl, "_blank");
  };


  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold font-headline">Contact Us</CardTitle>
            <CardDescription>Have a question or feedback? We'd love to hear from you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Your Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="email"
                  placeholder="Your Email (Optional)" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <PenSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Subject (Optional)" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                 <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                <Textarea 
                  placeholder="Your Message" 
                  className="min-h-[150px] pl-10 pt-3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div className="text-center">
                <Button type="submit" size="lg">Send Message via WhatsApp</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-xl text-center font-headline">Alternative Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
                <p className="text-muted-foreground">Or contact us directly by email</p>
                <a href="mailto:contact@huzi.pk" className="inline-flex items-center text-primary hover:underline font-semibold">
                    <AtSign className="mr-2 h-5 w-5" />
                    contact@huzi.pk
                </a>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
