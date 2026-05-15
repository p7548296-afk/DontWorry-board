"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LightboxProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export function Lightbox({ src, alt, children }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{alt}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div 
          className="relative w-full h-full flex items-center justify-center cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-all duration-300"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
