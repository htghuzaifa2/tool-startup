"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { tools, guides } from "@/lib/search-data"

type SearchResult = {
    icon: React.ReactNode;
    href: string;
    title: string;
    description: string;
};

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("tools")

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleResultClick = () => {
    setOpen(false)
    setQuery("")
  }

  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(query.toLowerCase()) || 
    tool.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(query.toLowerCase()) || 
    guide.description.toLowerCase().includes(query.toLowerCase())
  );

  const renderResults = (results: SearchResult[]) => {
      if(query.length > 0 && results.length === 0) {
        return <div className="py-12 text-center text-muted-foreground">No results found.</div>
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
          {results.map((result) => (
            <Link href={result.href} key={result.href} className="group" onClick={handleResultClick}>
              <Card className="h-full hover:border-primary transition-colors duration-300">
                <CardHeader>
                  <div className="mb-2 text-primary">{result.icon}</div>
                  <CardTitle className="font-headline text-base">{result.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{result.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] p-0 sm:p-4 sm:rounded-lg top-0 sm:top-[40%] translate-y-0 sm:-translate-y-1/2 rounded-none border-0 sm:border h-screen sm:h-auto sm:max-h-[70vh] flex flex-col overflow-hidden">
         <DialogHeader className="p-4 sm:p-0 border-b sm:border-0">
           <DialogTitle className="sr-only">Search</DialogTitle>
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for tools or guides..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </DialogHeader>
       
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1 overflow-hidden mt-2">
          <div className="px-4 sm:px-0">
             <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tools">Tools ({filteredTools.length})</TabsTrigger>
                <TabsTrigger value="guides">Guides ({filteredGuides.length})</TabsTrigger>
            </TabsList>
          </div>
            <div className="flex-1 overflow-auto mt-4">
              <ScrollArea className="h-full">
                <div className="pr-4">
                  <TabsContent value="tools" className="mt-0">
                      {renderResults(filteredTools)}
                  </TabsContent>
                  <TabsContent value="guides" className="mt-0">
                      {renderResults(filteredGuides)}
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
