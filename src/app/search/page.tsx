"use client"

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon } from "lucide-react"
import Link from "next/link"
import { tools } from "@/lib/search-data"
import Fuse from 'fuse.js'

function SearchResults() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState(tools)

  const fuse = new Fuse(tools, {
    keys: ['title', 'description', 'href'],
    threshold: 0.4, // Lower is stricter, higher is fuzzier. 0.4 is a good balance for typos.
    distance: 100,
  })

  useEffect(() => {
    if (query.trim()) {
      const searchResults = fuse.search(query)
      setResults(searchResults.map(result => result.item))
    } else {
      setResults(tools)
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The state update in useEffect handles the search. 
    // We could update the URL here if we wanted deep linking persistence on interaction.
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    window.history.pushState({}, '', url);
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-headline">Search Tools</h1>
          <p className="text-muted-foreground text-lg">
            Find the perfect tool for your task.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search for tools..." 
              className="pl-10 h-12 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-8">
            Search
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.length > 0 ? (
            results.map((tool) => (
              <Link href={tool.href} key={tool.href} className="group">
                <Card className="h-full hover:border-primary transition-colors duration-300 hover:shadow-md">
                  <CardHeader>
                    <div className="mb-4 text-primary p-3 bg-primary/10 w-fit rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {tool.icon}
                    </div>
                    <CardTitle className="font-headline text-xl">{tool.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p className="text-xl">No tools found matching "{query}".</p>
              <p className="mt-2">Try checking your spelling or using different keywords.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-10 text-center">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  )
}
