'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RotatingImagesProps {
  images: string[];
}

const RotatingImages: React.FC<RotatingImagesProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [images.length])

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className="relative w-[384px] aspect-[10/17] overflow-hidden rounded-lg shadow-xl">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Slide ${index + 1}`}
          fill
          quality={80}
          priority={index === 0}
          className={`absolute top-0 left-0 object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default RotatingImages