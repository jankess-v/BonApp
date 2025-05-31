"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ChefHat, Clock, Users } from "lucide-react"
import toast from "react-hot-toast"

import { recipeAPI } from "../services/recipeAPI"
import { RECIPE_CATEGORIES, DIFFICULTY_LEVELS } from "../constants/recipeData"
import IngredientInput from "../components/recipe/IngredientInput"
import InstructionInput from "../components/recipe/InstructionInput"
import ImageUpload from "../components/recipe/ImageUpload"

const AddRecipe = () => {
    const navigate = useNavigate()
    const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "szt" }])
    const [instructions, setInstructions] = useState([""])
    const [recipeImage, setRecipeImage] = useState(null)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            category: "",
            difficultyLevel: "",
            cookingTime: "",
            isPublic: true,
        },
    })

    const onSubmit = async (data) => {
        try {

            // Walidacja składników
            const validIngredients = ingredients.filter(
                (ing) => ing.name.trim() && ing.quantity && Number.parseFloat(ing.quantity) > 0,
            )

            if (validIngredients.length === 0) {
                toast.error("Dodaj co najmniej jeden składnik")
                return
            }

            // Walidacja instrukcji
            const validInstructions = instructions.filter((inst) => inst.trim())

            if (validInstructions.length === 0) {
                toast.error("Dodaj co najmniej jedną instrukcję")
                return
            }

            const recipeData = {
                ...data,
                ingredients: validIngredients.map((ing) => ({
                    ...ing,
                    quantity: Number.parseFloat(ing.quantity),
                })),
                instructions: validInstructions,
                image: recipeImage,
                cookingTime: data.cookingTime ? Number.parseInt(data.cookingTime) : undefined,
            }

            const response = await recipeAPI.createRecipe(recipeData)

            if (response.success) {
                toast.success("Przepis został dodany pomyślnie!")
                navigate("/recipes")
            }
        } catch (error) {
            console.error("Error creating recipe:", error)
            const message = error.response?.data?.message || "Błąd podczas dodawania przepisu"
            toast.error(message)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gray-900 p-3 rounded-full">
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dodaj nowy przepis</h1>
                    <p className="text-gray-600">Podziel się swoim ulubionym przepisem ze społecznością</p>
                </div>

                {/* Form */}
                <div className="card">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Podstawowe informacje */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Tytuł */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa przepisu *</label>
                                <input
                                    {...register("title", {
                                        required: "Nazwa przepisu jest wymagana",
                                        maxLength: {
                                            value: 100,
                                            message: "Nazwa nie może przekraczać 100 znaków",
                                        },
                                    })}
                                    className={`input-field ${errors.title ? "border-red-300 focus:ring-red-500" : ""}`}
                                    placeholder="np. Spaghetti Carbonara"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                            </div>

                            {/* Kategoria */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria *</label>
                                <select
                                    {...register("category", { required: "Kategoria jest wymagana" })}
                                    className={`input-field ${errors.category ? "border-red-300 focus:ring-red-500" : ""}`}
                                >
                                    <option value="">Wybierz kategorię</option>
                                    {RECIPE_CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                            </div>

                            {/* Poziom trudności */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Poziom trudności *</label>
                                <select
                                    {...register("difficultyLevel", { required: "Poziom trudności jest wymagany" })}
                                    className={`input-field ${errors.difficultyLevel ? "border-red-300 focus:ring-red-500" : ""}`}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Czas przygotowania (minuty)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register("cookingTime", {
                                            min: { value: 1, message: "Czas musi być większy niż 0" },
                                            max: { value: 1440, message: "Czas nie może przekraczać 24 godzin" },
                                        })}
                                        type="number"
                                        className={`input-field pl-10 ${errors.cookingTime ? "border-red-300 focus:ring-red-500" : ""}`}
                                        placeholder="30"
                                    />
                                </div>
                                {errors.cookingTime && <p className="mt-1 text-sm text-red-600">{errors.cookingTime.message}</p>}
                            </div>
                        </div>

                        {/* Opis */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Opis przepisu</label>
                            <textarea
                                {...register("description", {
                                    maxLength: {
                                        value: 500,
                                        message: "Opis nie może przekraczać 500 znaków",
                                    },
                                })}
                                rows={4}
                                className={`input-field resize-none ${errors.description ? "border-red-300 focus:ring-red-500" : ""}`}
                                placeholder="Krótki opis przepisu, jego pochodzenie lub specjalne wskazówki..."
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                        </div>

                        {/* Składniki */}
                        <IngredientInput ingredients={ingredients} onChange={setIngredients} />

                        {/* Instrukcje */}
                        <InstructionInput instructions={instructions} onChange={setInstructions} />


                        {/* Zdjęcie */}
                        <ImageUpload image={recipeImage} onChange={setRecipeImage} />

                        {/* Ustawienia widoczności */}
                        <div className="flex items-center">
                            <input
                                {...register("isPublic")}
                                type="checkbox"
                                className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                Udostępnij przepis publicznie (inni użytkownicy będą mogli go zobaczyć)
                            </label>
                        </div>

                        {/* Przyciski */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button type="button" onClick={() => navigate("/recipes")} className="btn-secondary flex-1">
                                Anuluj
                            </button>
                            <button type="submit"  className="btn-primary flex-1 flex items-center justify-center">
                                    "Dodaj przepis"
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddRecipe
