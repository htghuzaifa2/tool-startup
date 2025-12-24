
"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { tools } from "@/lib/search-data"
import { useState, useMemo, useEffect } from "react"
import { GetStartedButton } from "@/components/ui/get-started-button"
import { useRouter, usePathname, useSearchParams } from 'next/navigation'



const ITEMS_PER_PAGE = 24;

export default function Home() {
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

  const totalPages = Math.ceil(tools.length / ITEMS_PER_PAGE);

  const currentTools = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return tools.slice(startIndex, endIndex);
  }, [currentPage]);
  
  const goToPage = (page: number) => {
    setIsAnimating(true);
    
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', String(page));
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
    
    const toolsSection = document.getElementById('tools');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
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
    <main>
      <section className="py-20 md:py-32">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Your Ultimate Digital Toolbox
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            A curated collection of client-side utilities and tools to streamline your everyday tasks.
          </p>
          <div className="mt-8 flex justify-center">
             <a href="#tools" className="block">
                <GetStartedButton>EXPLORE TOOLS</GetStartedButton>
             </a>
          </div>
        </div>
      </section>

      <section id="tools" className="py-16 bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">
              Explore Our Tools
            </h2>
          </div>
          
          {renderPagination()}
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {currentTools.map((tool) => (
              <Link href={tool.href} key={tool.href} className="group">
                <Card className="h-full hover:border-primary transition-colors duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="mb-4 text-primary">{tool.icon}</div>
                    <CardTitle className="font-headline">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            {renderPagination()}
          </div>
        </div>
      </section>
    </main>
  );
}
