"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"

const RecipeImage = ({ image, title, className = "" }) => {
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)

    // Jeśli brak zdjęcia lub błąd ładowania
    if (!image || !image.url || imageError) {
        return (
            <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
                <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {imageLoading && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                </div>
            )}

            <img
                src={image.url || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                    setImageError(true)
                    setImageLoading(false)
                }}
            />
        </div>
    )
}

export default RecipeImage
