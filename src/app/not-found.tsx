
"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, FileSearch } from 'lucide-react'
import { GetStartedButton } from '@/components/ui/get-started-button'


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <FileSearch className="w-24 h-24 text-primary/30 mb-6" strokeWidth={1} />
      <h1 className="text-6xl md:text-8xl font-bold font-headline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-4 mb-2">
        Page Not Found
      </h2>
      <p className="max-w-md text-muted-foreground mb-8">
        Oops! The page you're looking for doesn't seem to exist. Let's get you back on track.
      </p>
      <Link href="/">
        <GetStartedButton>
            RETURN HOME
        </GetStartedButton>
      </Link>
    </div>
  )
}
