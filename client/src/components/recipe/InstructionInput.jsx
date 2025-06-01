"use client"

import {Plus, X, GripVertical, ArrowUp} from "lucide-react"

const InstructionInput = ({ instructions, onChange }) => {
    const addInstruction = () => {
        onChange([...instructions, ""])
    }

    const removeInstruction = (index) => {
        onChange(instructions.filter((_, i) => i !== index))
    }

    const updateInstruction = (index, value) => {
        const updated = instructions.map((instruction, i) => (i === index ? value : instruction))
        onChange(updated)
    }

    const moveInstruction = (fromIndex, toIndex) => {
        const updated = [...instructions]
        const [movedItem] = updated.splice(fromIndex, 1)
        updated.splice(toIndex, 0, movedItem)
        onChange(updated)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Instrukcje przygotowania</label>
                <button
                    type="button"
                    onClick={addInstruction}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Dodaj krok
                </button>
            </div>

            {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-3">
                    {/* Numer kroku */}
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mt-2">
                        {index + 1}
                    </div>

                    {/* Pole tekstowe */}
                    <div className="flex-1">
            <textarea
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder={`Krok ${index + 1}: Opisz co należy zrobić...`}
                rows={1}
                className="block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 resize-none"
            />
                    </div>

                    {/* Przyciski akcji - teraz w jednej linii */}
                    <div className="flex items-center space-x-1 mt-2">
                        {/* Przesuń w górę */}
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    const updatedInstructions = [...instructions];
                                    [updatedInstructions[index], updatedInstructions[index - 1]] = [
                                        updatedInstructions[index - 1],
                                        updatedInstructions[index]
                                    ];
                                    onChange(updatedInstructions);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Przesuń w górę"
                            >
                                <ArrowUp className="w-4 h-4 cursor-pointer" />
                            </button>
                        )}

                        {/* Usuń krok */}
                        <button
                            type="button"
                            onClick={() => removeInstruction(index)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Usuń krok"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}

            {instructions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>Brak instrukcji. Kliknij "Dodaj krok", aby rozpocząć.</p>
                </div>
            )}
        </div>
    );
}

export default InstructionInput
