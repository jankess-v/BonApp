import { useState } from "react"
import { Search, X } from "lucide-react"

const SearchBar = ({ value, onChange, onClear, placeholder = "Szukaj przepisów..." }) => {
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="block w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none border-gray-400">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="focus:outline-none pl-10 pr-10 w-full"
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
