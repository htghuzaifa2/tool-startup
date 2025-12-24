"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, ShoppingCart } from 'lucide-react'
import products from '@/lib/products.json'
import { cn } from '@/lib/utils'

interface Product {
  id: number;
  slug: string;
  title: string;
  price: string;
  imageUrl: string;
}

const DISMISS_COOLDOWN = 60 * 1000; // 60 seconds
const INITIAL_APPEAR_DELAY = 10 * 1000; // 10 seconds
const PRODUCT_ROTATION_INTERVAL = 30 * 1000; // 30 seconds

export function ProductPopup() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  const getRandomProduct = () => {
    return products[Math.floor(Math.random() * products.length)];
  };

  useEffect(() => {
    // Check dismissal status from localStorage on initial load
    const dismissedUntil = localStorage.getItem('product-popup-dismissed-until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
        setIsDismissed(true);
    } else {
        setIsDismissed(false);
    }
  }, []);

  useEffect(() => {
    let mainTimer: NodeJS.Timeout;

    if (!isDismissed) {
        // If not dismissed, show popup after initial delay
        mainTimer = setTimeout(() => {
            if (!product) { // Only set initial product if one isn't already there
              setProduct(getRandomProduct());
            }
            setIsVisible(true);
        }, INITIAL_APPEAR_DELAY);
    } else {
        // If dismissed, check periodically if the cooldown has expired
        mainTimer = setInterval(() => {
            const dismissedUntil = localStorage.getItem('product-popup-dismissed-until');
            if (!dismissedUntil || Date.now() > parseInt(dismissedUntil, 10)) {
                setIsDismissed(false);
            }
        }, 1000);
    }

    return () => clearTimeout(mainTimer);
  }, [isDismissed, product]);

  useEffect(() => {
    // This effect handles the product rotation when the popup is visible.
    if (isVisible) {
      const rotationInterval = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setProduct(prevProduct => {
            let newProduct = getRandomProduct();
            while (newProduct.slug === prevProduct?.slug) {
              newProduct = getRandomProduct();
            }
            return newProduct;
          });
          setIsFading(false);
        }, 500);
      }, PRODUCT_ROTATION_INTERVAL);

      return () => clearInterval(rotationInterval);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsFading(false);
      const dismissedUntil = Date.now() + DISMISS_COOLDOWN;
      localStorage.setItem('product-popup-dismissed-until', dismissedUntil.toString());
      setIsDismissed(true);
    }, 500);
  };

  if (!product || !isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 w-80 transform transition-all duration-500 ease-in-out',
        isVisible && !isFading ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      )}
    >
      <Card className="overflow-hidden shadow-2xl border-primary/20">
        <CardContent className="p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>

          <div className="flex gap-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-headline text-sm font-semibold line-clamp-2">
                {product.title}
              </h4>
              <p className="text-lg font-bold text-primary">PKR {product.price}</p>
              <Button asChild size="sm" className="mt-2">
                <Link href={`https://huzi.pk/product/${product.slug}`} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Product
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
