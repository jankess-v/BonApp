import CategoryCard from "./CategoryCard.jsx";
import {Link} from "react-router-dom";
import {RECIPE_CATEGORIES_HOME} from "../constants/recipeData.js";

const RecommendedCategories = () => {
    return (
        <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Polecane kategorie</h2>
                <Link to="/recipes">
                    <button className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer">
                        Zobacz wszystkie →
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {
                    RECIPE_CATEGORIES_HOME.map(category => (
                        <CategoryCard key={category.name} category={category.name} image={category.image} />
                ))}
            </div>
        </section>
    )
}

export default RecommendedCategories;