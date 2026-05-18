"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxProps {
  src?: string;
  images?: string[];
  startIndex?: number;
  alt: string;
  children: React.ReactNode;
}

export function Lightbox({ src, images = [], startIndex = 0, alt, children }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  // Normalize images to always be an array
  const allImages = images.length > 0 ? images : src ? [src] : [];
  
  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev]);

  if (allImages.length === 0) return <>{children}</>;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent 
        showCloseButton={false}
        className="max-w-none sm:max-w-none h-screen sm:h-screen w-screen p-0 gap-0 overflow-hidden bg-black/95 border-none shadow-none flex items-center justify-center z-[100]"
      >
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{alt}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        
        <div 
          className="relative w-full h-full flex items-center justify-center p-2 md:p-8 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 z-[110] rounded-full h-10 w-10 md:h-12 md:w-12"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </Button>

          {/* Navigation - Prev */}
          {allImages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 z-[110] rounded-full h-12 w-12 md:h-16 md:w-16 hidden md:flex"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
            </Button>
          )}

          {/* Image */}
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allImages[currentIndex]}
              alt={`${alt} - ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 pointer-events-none select-none"
            />
          </div>

          {/* Navigation - Next */}
          {allImages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 z-[110] rounded-full h-12 w-12 md:h-16 md:w-16 hidden md:flex"
              onClick={handleNext}
            >
              <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
            </Button>
          )}

          {/* Mobile Navigation Controls */}
          {allImages.length > 1 && (
            <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-8 md:hidden z-[110]">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-12 w-12"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-12 w-12"
                onClick={handleNext}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </div>
          )}

          {/* Index indicator */}
          {allImages.length > 1 && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/10 tracking-widest z-[110]">
              {currentIndex + 1} <span className="text-white/40 mx-1">/</span> {allImages.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
