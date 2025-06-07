import { Clock, ChefHat } from "lucide-react"
import { DIFFICULTY_LEVELS } from "../../constants/recipeData"
import RecipeImage from "./RecipeImage"

const RecipeCard = ({ recipe, onClick }) => {
    const difficultyConfig = DIFFICULTY_LEVELS.find((level) => level.value === recipe.difficultyLevel)

    const formatTime = (minutes) => {
        if (!minutes) return "Nie podano"
        if (minutes < 60) return `${minutes} min`
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
    }

    return (
        <div
            onClick={() => onClick?.(recipe)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
            {/* Image */}
            <div className="relative">
                <RecipeImage
                    image={recipe.image}
                    title={recipe.title}
                    className="aspect-video w-full group-hover:scale-105 transition-transform duration-200"
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
          <span className="bg-white bg-opacity-90 text-gray-900 text-xs font-medium px-2 py-1 rounded-full">
            {recipe.category}
          </span>
                </div>

                {/* Difficulty Badge */}
                <div className="absolute top-3 right-3">
          <span
              className={`bg-white bg-opacity-90 text-xs font-medium px-2 py-1 rounded-full ${
                  difficultyConfig?.color || "text-gray-600"
              }`}
          >
            {difficultyConfig?.label || recipe.difficultyLevel}
          </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                    {recipe.title}
                </h3>

                {/* Description */}
                {recipe.description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    {/* Cooking Time */}
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatTime(recipe.cookingTime)}</span>
                    </div>
                </div>

                {/* Author */}
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        <ChefHat className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {recipe.authorId?.firstName} {recipe.authorId?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">@{recipe.authorId?.username}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipeCard
