
"use client"

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides as allGuides } from "@/lib/search-data";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'


const ITEMS_PER_PAGE = 24;

export default function GuidePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getPageFromParams = () => {
    const page = searchParams.get('page');
    const pageNumber = page ? parseInt(page, 10) : 1;
    return isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
  }

  const [currentPage, setCurrentPage] = useState(getPageFromParams);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentPage(getPageFromParams());
  }, [searchParams]);


  const totalPages = Math.ceil(allGuides.length / ITEMS_PER_PAGE);

  const currentGuides = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allGuides.slice(startIndex, endIndex);
  }, [currentPage]);
  
  const goToPage = (page: number) => {
    setIsAnimating(true);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', String(page));
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);

    const guideSection = document.getElementById('guides-section');
    if (guideSection) {
      guideSection.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
        setIsAnimating(false);
    }, 500); // must match animation duration
  }
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-4">
        <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1 || isAnimating} variant="secondary">
          Previous Page
        </Button>
        <span className="text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || isAnimating} variant="secondary">
          Next Page
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10" id="guides-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            Tool Guides
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Your step-by-step instructions for using our powerful tools.
          </p>
        </div>

        {renderPagination()}

        <div className={`space-y-8 mt-8 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {currentGuides.map((guide, index) => (
             <Card key={guide.href} id={guide.href.replace('/guide#', '')}>
              <CardHeader>
                <Link href={guide.href.replace('/guide#', '/')}>
                  <div className="flex items-center gap-4">
                      {guide.icon}
                      <div>
                          <CardTitle className="font-headline">{guide.title}</CardTitle>
                          <CardDescription>{guide.description}</CardDescription>
                      </div>
                  </div>
                </Link>
              </CardHeader>
              <CardContent>
                  <Accordion type="single" collapsible>
                      <AccordionItem value={`item-${index}`}>
                          <AccordionTrigger>
                            How to Use
                          </AccordionTrigger>
                          <AccordionContent>
                              <ol className="list-decimal list-inside space-y-2 pt-2 text-muted-foreground">
                                  {guide.steps.map((step, stepIndex) => (
                                      <li key={stepIndex}>{step}</li>
                                  ))}
                              </ol>
                          </AccordionContent>
                      </AccordionItem>
                  </Accordion>
              </CardContent>
          </Card>
          ))}
        </div>
         <div className="mt-12">
           {renderPagination()}
         </div>
      </div>
    </div>
  );
}
