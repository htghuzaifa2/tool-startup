
"use client"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Another great website by{' '}
          <a
            href="https://huzi.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            huzi.pk
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
