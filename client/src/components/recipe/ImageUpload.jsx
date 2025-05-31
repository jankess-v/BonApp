"use client"

import { useState, useRef } from "react"
import { X, ImageIcon } from "lucide-react"
import toast from "react-hot-toast"

const ImageUpload = ({ image, onChange, recipeId }) => {
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const handleFiles = async (files) => {
        const file = files[0]
        if (!file) return

        // Walidacja typu pliku
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if (!validTypes.includes(file.type)) {
            toast.error("Dozwolone są tylko pliki JPG, PNG i WebP")
            return
        }

        // Sprawdzenie rozmiaru pliku
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Maksymalny rozmiar pliku to 5MB")
            return
        }

        setUploading(true)

        try {
            const formData = new FormData()
            formData.append("image", file)
            if (recipeId) {
                formData.append("recipeId", recipeId)
            }

            const response = await fetch("/api/images/recipes", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            })

            const data = await response.json()

            if (data.success) {
                onChange(data.data.image)
                toast.success("Zdjęcie zostało dodane pomyślnie")
            } else {
                toast.error(data.message || "Błąd podczas dodawania zdjęcia")
            }
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Błąd podczas dodawania zdjęcia")
        } finally {
            setUploading(false)
        }
    }

    const removeImage = async () => {
        if (!recipeId) {
            // Jeśli nie ma recipeId, po prostu usuń lokalnie
            onChange(null)
            return
        }

        try {
            const response = await fetch(`/api/images/recipes/${recipeId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            if (response.ok) {
                onChange(null)
                toast.success("Zdjęcie zostało usunięte")
            } else {
                toast.error("Błąd podczas usuwania zdjęcia")
            }
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("Błąd podczas usuwania zdjęcia")
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files)
        }
    }

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Zdjęcie przepisu</label>

            {/* Current Image */}
            {image && (
                <div className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.originalName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Remove Button */}
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Image Info */}
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">{image.originalName}</p>
                        <p className="text-xs text-gray-400">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
            )}

            {/* Upload Area */}
            {!image && (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                        dragActive ? "border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                    />

                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            {uploading ? (
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                            ) : (
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-900">
                                {uploading ? "Dodawanie zdjęcia..." : "Dodaj zdjęcie przepisu"}
                            </p>
                            <p className="text-sm text-gray-500">
                                Przeciągnij i upuść plik lub{" "}
                                <button
                                    type="button"
                                    onClick={openFileDialog}
                                    className="text-gray-900 font-medium hover:text-gray-700"
                                    disabled={uploading}
                                >
                                    wybierz z komputera
                                </button>
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG, WebP do 5MB</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageUpload
