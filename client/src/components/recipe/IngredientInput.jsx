import { useState } from "react";
import { Plus, X } from "lucide-react";
import { UNITS, COMMON_INGREDIENTS } from "../../constants/recipeData";

const IngredientInput = ({ ingredients, onChange }) => {
    const [showSuggestions, setShowSuggestions] = useState(null);

    const addIngredient = () => {
        onChange([...ingredients, { name: "", quantity: "", unit: "szt" }]);
    };

    const removeIngredient = (index) => {
        onChange(ingredients.filter((_, i) => i !== index));
    };

    const updateIngredient = (index, field, value) => {
        const updated = ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, [field]: value } : ingredient
        );
        onChange(updated);
    };

    const handleNameChange = (index, value) => {
        updateIngredient(index, "name", value);
        setShowSuggestions(value ? index : null);
    };

    const selectSuggestion = (index, suggestion) => {
        updateIngredient(index, "name", suggestion);
        setShowSuggestions(null);
    };

    const filteredSuggestions = (currentValue) => {
        if (!currentValue) return [];
        return COMMON_INGREDIENTS.filter((ingredient) =>
            ingredient.toLowerCase().includes(currentValue.toLowerCase())
        ).slice(0, 5);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Składniki</label>
                <button
                    type="button"
                    onClick={addIngredient}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Dodaj składnik
                </button>
            </div>

            {ingredients.length > 0 && (
                <div className="space-y-4">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            {/* Numer składnika - opcjonalnie */}
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mt-2">
                                {index + 1}
                            </div>

                            {/* Pole nazwy składnika */}
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={ingredient.name}
                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                    placeholder="Nazwa składnika"
                                    className="block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                    autoComplete="off"
                                />

                                {/* Sugestie */}
                                {showSuggestions === index && ingredient.name && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                        {filteredSuggestions(ingredient.name).map((suggestion, suggestionIndex) => (
                                            <button
                                                key={suggestionIndex}
                                                type="button"
                                                onClick={() => selectSuggestion(index, suggestion)}
                                                className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Ilość */}
                            <div className="w-24">
                                <input
                                    type="number"
                                    value={ingredient.quantity}
                                    onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                                    placeholder="Ilość"
                                    min="0"
                                    step="0.1"
                                    className="block w-full pl-5 pr-3 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                />
                            </div>

                            {/* Jednostka */}
                            <div className="w-24">
                                <select
                                    value={ingredient.unit}
                                    onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                                    className="block w-full pl-2 pr-0 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                >
                                    {UNITS.map((unit) => (
                                        <option key={unit.value} value={unit.value}>
                                            {unit.value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Przyciski akcji */}
                            <div className="flex items-center space-x-1 mt-2">
                                <button
                                    type="button"
                                    onClick={() => removeIngredient(index)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Usuń składnik"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {ingredients.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>Brak składników. Kliknij "Dodaj składnik", aby rozpocząć.</p>
                </div>
            )}
        </div>
    );
};

export default IngredientInput;