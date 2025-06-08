"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push("...")
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push("...")
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push("...")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push("...")
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="flex items-center justify-center space-x-2">
            {/* Previous Button */}
            {/*<button*/}
            {/*    onClick={() => onPageChange(currentPage - 1)}*/}
            {/*    disabled={currentPage === 1}*/}
            {/*    className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"*/}
            {/*>*/}
            {/*    <ChevronLeft className="w-5 h-5" />*/}
            {/*</button>*/}

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === "number" && onPageChange(page)}
                    disabled={page === "..."}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                            ? "bg-gray-900 text-white"
                            : page === "..."
                                ? "text-gray-400 cursor-default"
                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-300"
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            {/*<button*/}
            {/*    onClick={() => onPageChange(currentPage + 1)}*/}
            {/*    disabled={currentPage === totalPages}*/}
            {/*    className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"*/}
            {/*>*/}
            {/*    <ChevronRight className="w-5 h-5" />*/}
            {/*</button>*/}
        </div>
    )
}

export default Pagination
