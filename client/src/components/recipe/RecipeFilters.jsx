import { Filter, X } from "lucide-react"
import { RECIPE_CATEGORIES, DIFFICULTY_LEVELS } from "../../constants/recipeData"

const RecipeFilters = ({ filters, onChange, onClear }) => {
    const handleFilterChange = (key, value) => {
        onChange({
            ...filters,
            [key]: value,
        })
    }

    const hasActiveFilters = filters.category !== "all" || filters.difficulty !== "all"

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Filter className="w-5 h-5 text-gray-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Filtry</h3>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={onClear}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Wyczyść
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                        className="input-field"
                    >
                        <option value="all">Wszystkie kategorie</option>
                        {RECIPE_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Poziom trudności</label>
                    <select
                        value={filters.difficulty}
                        onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                        className="input-field"
                    >
                        <option value="all">Wszystkie poziomy</option>
                        {DIFFICULTY_LEVELS.map((level) => (
                            <option key={level.value} value={level.value}>
                                {level.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Aktywne filtry:</p>
                    <div className="flex flex-wrap gap-2">
                        {filters.category !== "all" && (
                            <span className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                Kategoria: {filters.category}
                                <button
                                    onClick={() => handleFilterChange("category", "all")}
                                    className="ml-2 text-gray-500 hover:text-gray-700"
                                >
                  <X className="w-3 h-3" />
                </button>
              </span>
                        )}

                        {filters.difficulty !== "all" && (
                            <span className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                Trudność: {DIFFICULTY_LEVELS.find((l) => l.value === filters.difficulty)?.label}
                                <button
                                    onClick={() => handleFilterChange("difficulty", "all")}
                                    className="ml-2 text-gray-500 hover:text-gray-700"
                                >
                  <X className="w-3 h-3" />
                </button>
              </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecipeFilters
