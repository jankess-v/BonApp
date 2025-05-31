"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { ChefHat, Utensils } from "lucide-react"
import toast from "react-hot-toast"

import { recipeAPI } from "../services/recipeAPI"
import RecipeCard from "../components/recipe/RecipeCard"
import SearchBar from "../components/recipe/SearchBar"
import RecipeFilters from "../components/recipe/RecipeFilters"
import Pagination from "../components/recipe/Pagination"
import Navbar from "../components/Navbar.jsx";

const PublicRecipes = () => {
    const navigate = useNavigate()
    const [recipes, setRecipes] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState({
        category: "all",
        difficulty: "all",
    })
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
    })

    // Debounced search
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const fetchRecipes = useCallback(
        async (page = 1) => {
            try {

                const params = {
                    page,
                    limit: 12,
                }

                if (debouncedSearchTerm) {
                    params.search = debouncedSearchTerm
                }

                if (filters.category !== "all") {
                    params.category = filters.category
                }

                if (filters.difficulty !== "all") {
                    params.difficulty = filters.difficulty
                }

                const response = await recipeAPI.getPublicRecipes(params)

                if (response.success) {
                    setRecipes(response.data.recipes)
                    setPagination(response.data.pagination)
                }
            } catch (error) {
                console.error("Error fetching recipes:", error)
                toast.error("Błąd podczas ładowania przepisów")
            }
        },
        [debouncedSearchTerm, filters],
    )

    // Fetch recipes when filters or search change
    useEffect(() => {
        fetchRecipes(1)
    }, [fetchRecipes])

    const handlePageChange = (page) => {
        fetchRecipes(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleSearchClear = () => {
        setSearchTerm("")
    }

    const handleFiltersClear = () => {
        setFilters({
            category: "all",
            difficulty: "all",
        })
    }

    const handleRecipeClick = (recipe) => {
        navigate(`/recipe/${recipe._id}`)
    }

    const getResultsText = () => {
        const { total } = pagination
        if (total === 0) return "Brak wyników"
        if (total === 1) return "1 przepis"
        if (total < 5) return `${total} przepisy`
        return `${total} przepisów`
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gray-900 p-3 rounded-full">
                                <Utensils className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Publiczne przepisy</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Odkryj inspirujące przepisy od społeczności miłośników gotowania. Znajdź coś nowego dla siebie!
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="mb-8 space-y-6">
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onClear={handleSearchClear}
                            placeholder="Szukaj przepisów po nazwie lub składnikach..."
                        />
                    </div>

                    {/* Filters */}
                    <RecipeFilters filters={filters} onChange={setFilters} onClear={handleFiltersClear} />
                </div>

                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold text-gray-900">Wyniki wyszukiwania</h2>
                        <span className="text-gray-500">({getResultsText()})</span>
                    </div>

                    {/* Sort Options - Future enhancement */}
                    <div className="hidden md:flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Sortuj:</span>
                        <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                            <option value="newest">Najnowsze</option>
                            <option value="oldest">Najstarsze</option>
                            <option value="name">Nazwa A-Z</option>
                        </select>
                    </div>
                </div>


                {/* Empty State */}
                {recipes.length === 0 && (
                    <div className="text-center py-12">
                        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Brak przepisów</h3>
                        <p className="text-gray-500 mb-6">
                            {debouncedSearchTerm || filters.category !== "all" || filters.difficulty !== "all"
                                ? "Nie znaleziono przepisów spełniających kryteria wyszukiwania."
                                : "Nie ma jeszcze żadnych publicznych przepisów."}
                        </p>
                        {(debouncedSearchTerm || filters.category !== "all" || filters.difficulty !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("")
                                    handleFiltersClear()
                                }}
                                className="btn-secondary"
                            >
                                Wyczyść filtry
                            </button>
                        )}
                    </div>
                )}

                {/* Recipes Grid */}
                {recipes.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {recipes.map((recipe) => (
                                <RecipeCard key={recipe._id} recipe={recipe} onClick={handleRecipeClick} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={pagination.current}
                            totalPages={pagination.pages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default PublicRecipes
