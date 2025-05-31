"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"

const SearchBar = ({ value, onChange, onClear, placeholder = "Szukaj przepisów..." }) => {
    const [isFocused, setIsFocused] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        // Search is handled by onChange in real-time
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className={`relative transition-all duration-200 ${isFocused ? "ring-2 ring-gray-500 ring-offset-2" : ""}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="input-field pl-10 pr-10 w-full"
                />

                {value && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </form>
    )
}

export default SearchBar
