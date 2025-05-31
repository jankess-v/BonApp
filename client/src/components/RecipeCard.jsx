const RecipeCard = ({ recipe }) => {
  const difficultyColors = {
    'Łatwy': 'bg-green-100 text-green-800',
    'Średni': 'bg-yellow-100 text-yellow-800',
    'Trudny': 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">Zdjęcie przepisu</span>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{recipe.title}</h3>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>⏱️ {recipe.cookingTime}</span>
          <span>👥 {recipe.servings} porcji</span>
        </div>

        <button className="w-full mt-4 px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm font-medium">
          Zobacz przepis
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;