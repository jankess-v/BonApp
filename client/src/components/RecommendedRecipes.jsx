import RecipeCard from "./RecipeCard.jsx";
import {Link} from "react-router-dom";

export const featuredRecipes = [
    {
        id: 1,
        title: "Spaghetti Carbonara",
        description: "Klasyczne włoskie danie z jajkami, bekonem i parmezanem. Proste w przygotowaniu, ale wymagające odpowiedniej techniki.",
        cookingTime: "20 min",
        difficulty: "Średni",
        servings: 4
    },
    {
        id: 2,
        title: "Pierogi ruskie",
        description: "Tradycyjne polskie pierogi z nadzieniem z ziemniaków i twarogu. Podawane z cebulką i śmietaną.",
        cookingTime: "90 min",
        difficulty: "Trudny",
        servings: 6
    },
    {
        id: 3,
        title: "Omlet z ziołami",
        description: "Puszysty omlet z mieszanką świeżych ziół. Idealny na szybkie śniadanie lub lekki obiad.",
        cookingTime: "10 min",
        difficulty: "Łatwy",
        servings: 2
    },
    {
        id: 4,
        title: "Kotlet schabowy",
        description: "Klasyczny polski kotlet schabowy z panierką. Soczysty w środku, chrupiący na zewnątrz.",
        cookingTime: "30 min",
        difficulty: "Średni",
        servings: 4
    },
    {
        id: 5,
        title: "Sałatka grecka",
        description: "Świeża sałatka z pomidorami, ogórkami, oliwkami i serem feta. Lekka i pełna smaku.",
        cookingTime: "15 min",
        difficulty: "Łatwy",
        servings: 4
    },
    {
        id: 6,
        title: "Placki ziemniaczane",
        description: "Tradycyjne polskie placki z tartych ziemniaków. Podawane ze śmietaną lub cukrem.",
        cookingTime: "45 min",
        difficulty: "Średni",
        servings: 4
    }
];

const RecommendedRecipes = () => {
    return (
        <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Polecane przepisy</h2>
                <Link to="/recipes">
                    <button className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer">
                        Zobacz wszystkie →
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe}/>
                ))}
            </div>
        </section>
    )
}

export default RecommendedRecipes;