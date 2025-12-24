
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Heart } from "lucide-react";
import { GetStartedButton } from "@/components/ui/get-started-button";


export default function AboutPage() {
  
  const openPortfolio = () => {
    window.open("https://huzi.pk/", "_blank");
  };

  return (
    <div className="relative overflow-hidden">
      <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
              style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
      </div>
      <div className="relative container mx-auto py-12 md:py-20 px-4">
          <div className="max-w-4xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      Our Mission
                  </h1>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                      Empowering everyone with simple, powerful, and privacy-focused tools that just work, right in your browser.
                  </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                  <Card className="bg-background/60 backdrop-blur-sm hover:border-primary transition-all duration-300 transform hover:scale-105">
                      <CardHeader className="text-center">
                          <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full mb-4">
                              <Heart className="w-10 h-10" />
                          </div>
                          <CardTitle className="font-headline">Built for You</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center text-muted-foreground">
                          We believe that powerful utilities should not be complicated or expensive. Our mission is to provide a collection of free, intuitive tools for developers, writers, and anyone looking to simplify a task.
                      </CardContent>
                  </Card>
                  <Card className="bg-background/60 backdrop-blur-sm hover:border-primary transition-all duration-300 transform hover:scale-105">
                      <CardHeader className="text-center">
                          <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full mb-4">
                              <ShieldCheck className="w-10 h-10" />
                          </div>
                          <CardTitle className="font-headline">Privacy First</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center text-muted-foreground">
                      Every tool on this platform runs directly in your browser. This means your data remains your own—never uploaded, never stored. Your privacy is paramount.
                      </CardContent>
                  </Card>
              </div>

              <div className="text-center pt-8">
                  <h2 className="text-3xl font-bold font-headline mb-4">Meet the Creator</h2>
                  <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                      This collection of tools is a passion project by a developer dedicated to building useful things for the web.
                  </p>
                  <div onClick={openPortfolio} className="flex justify-center">
                    <GetStartedButton>MEET THE CREATOR</GetStartedButton>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
