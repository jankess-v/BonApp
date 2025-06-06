import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {ChefHat, Clock, ArrowLeft} from "lucide-react";
import toast from "react-hot-toast";
import {recipeAPI} from "../services/recipeAPI";
import {RECIPE_CATEGORIES, DIFFICULTY_LEVELS} from "../constants/recipeData";
import IngredientInput from "../components/recipe/IngredientInput";
import InstructionInput from "../components/recipe/InstructionInput";
import ImageUpload from "../components/recipe/ImageUpload";
import {useAuth} from "../context/AuthContext.jsx";

const EditRecipe = () => {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const {id} = useParams();

    const [ingredients, setIngredients] = useState([{name: "", quantity: "", unit: "szt"}]);
    const [instructions, setInstructions] = useState([""]);
    const [recipeImage, setRecipeImage] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        if(!isAuthenticated) {
            navigate("/login");
        }

        const fetchRecipe = async () => {
            try {
                const response = await recipeAPI.getRecipe(id);
                const data = response.data.recipe

                // console.log(data)

                setIngredients(data.ingredients)
                setInstructions(data.instructions)
                setRecipeImage(data.image)

                reset({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    difficultyLevel: data.difficultyLevel,
                    cookingTime: data.cookingTime,
                    isPublic: data.isPublic,
                });
            } catch (error) {
                console.error("Błąd pobierania przepisu:", error)
                toast.error("Nie znaleziono przepisu")
                navigate("/recipes")
            }
        }

        fetchRecipe()
    }, [id])

    const onSubmit = async (data) => {
        try {
            // Walidacja składników
            const validIngredients = ingredients.filter(
                (ingredient) =>
                    ingredient.name.trim() && Number.parseFloat(ingredient.quantity) > 0
            );
            if (validIngredients.length === 0) {
                toast.error("Dodaj co najmniej jeden składnik");
                return;
            }

            // Walidacja instrukcji
            const validInstructions = instructions.filter((inst) => inst.trim());
            if (validInstructions.length === 0) {
                toast.error("Dodaj co najmniej jedną instrukcję");
                return;
            }

            const recipeData = {
                ...data,
                ingredients: validIngredients.map((ing) => ({
                    ...ing,
                    quantity: Number.parseFloat(ing.quantity),
                })),
                instructions: validInstructions,
                // image: recipeImage,
                cookingTime: data.cookingTime ? Number.parseInt(data.cookingTime) : undefined,
            };

            if(recipeImage) {
                const formData = new FormData();
                formData.append("image", recipeImage)

                const response = await fetch(`http://localhost:3000/api/images/recipes/${id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: formData,
                });

                if(!response.ok) {
                    console.log(response);
                    console.error("Error uploading image");
                    throw new Error("Error uploading image");
                }
                const result = await response.json()
                recipeData.image = result.data.image
            } else {
                recipeData.image = null
            }

            const response = await recipeAPI.updateRecipe(id, recipeData);
            if (response.success) {
                toast.success("Przepis został edytowany pomyślnie!");
                navigate("/recipes");
            }
        } catch (error) {
            console.error("Error editing recipe:", error);
            const message = error.response?.data?.message || "Błąd podczas edytowania przepisu";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 bg-white shadow-xl rounded-xl p-8 border border-gray-200">
                {/* Header */}
                <div className="text-center animate-fade-in">
                    <div className="flex justify-center items-center relative">
                        <Link to="/recipes"
                              className="absolute left-0 top-0 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                            <ArrowLeft className="h-6 w-6"/>
                        </Link>

                        <div className="flex flex-col items-center">
                            <div className="bg-gray-900 p-3 rounded-full">
                                <Link
                                    to="/home"
                                    className="text-gray-500 hover:text-gray-600 transition-colors duration-200"
                                >
                                    <ChefHat className="w-8 h-8 text-white hover:animate-pulse"/>
                                </Link>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mt-4">Edytuj przepis</h2>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Podstawowe informacje */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tytuł */}
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Nazwa przepisu *
                            </label>
                            <input
                                {...register("title", {
                                    required: "Nazwa przepisu jest wymagana",
                                    maxLength: {
                                        value: 100,
                                        message: "Nazwa nie może przekraczać 100 znaków",
                                    },
                                })}
                                type="text"
                                className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black ${
                                    errors.title
                                        ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                                        : "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                }`}
                                placeholder="np. Spaghetti Carbonara"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Kategoria */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Kategoria *
                            </label>
                            <select
                                {...register("category", {
                                    required: "Kategoria jest wymagana",
                                })}
                                className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none text-black ${
                                    errors.category
                                        ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                                        : "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                }`}
                            >
                                <option value="">Wybierz kategorię</option>
                                {RECIPE_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Poziom trudności */}
                        <div>
                            <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700 mb-2">
                                Poziom trudności *
                            </label>
                            <select
                                {...register("difficultyLevel", {
                                    required: "Poziom trudności jest wymagany",
                                })}
                                className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none text-black ${
                                    errors.difficultyLevel
                                        ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                                        : "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                }`}
                            >
                                <option value="">Wybierz poziom</option>
                                {DIFFICULTY_LEVELS.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                            {errors.difficultyLevel && (
                                <p className="mt-1 text-sm text-red-600">{errors.difficultyLevel.message}</p>
                            )}
                        </div>

                        {/* Czas przygotowania */}
                        <div>
                            <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700 mb-2">
                                Czas przygotowania (minuty)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    {...register("cookingTime", {
                                        min: {value: 1, message: "Czas musi być większy niż 0"},
                                        max: {value: 1440, message: "Czas nie może przekraczać 24 godzin"},
                                    })}
                                    type="number"
                                    className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black ${
                                        errors.cookingTime
                                            ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                                            : "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                    }`}
                                    placeholder="30"
                                />
                            </div>
                            {errors.cookingTime && (
                                <p className="mt-1 text-sm text-red-600">{errors.cookingTime.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Opis */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Opis przepisu
                        </label>
                        <textarea
                            {...register("description", {
                                maxLength: {
                                    value: 500,
                                    message: "Opis nie może przekraczać 500 znaków",
                                },
                            })}
                            rows={4}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black resize-none ${
                                errors.description
                                    ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                                    : "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                            }`}
                            placeholder="Krótki opis przepisu, jego pochodzenie lub specjalne wskazówki..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Składniki */}
                    <IngredientInput ingredients={ingredients} onChange={setIngredients}/>

                    {/* Instrukcje */}
                    <InstructionInput instructions={instructions} onChange={setInstructions}/>

                    {/* Zdjęcie */}
                    <ImageUpload image={recipeImage} setRecipeImage={setRecipeImage}/>

                    {/* Ustawienia widoczności */}
                    <div className="flex items-center">
                        <input
                            {...register("isPublic")}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Udostępnij przepis publicznie (inni użytkownicy będą mogli go zobaczyć)
                        </label>
                    </div>

                    {/* Przyciski */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/recipes")}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                        >
                            Edytuj przepis
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRecipe;