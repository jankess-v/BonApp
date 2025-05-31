"use client"

import { Plus, X, GripVertical } from "lucide-react"

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
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
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
                rows={3}
                className="input-field resize-none"
            />
                    </div>

                    {/* Przyciski akcji */}
                    <div className="flex flex-col space-y-1 mt-2">
                        {/* Przycisk usuwania */}
                        <button
                            type="button"
                            onClick={() => removeInstruction(index)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Przyciski przesuwania */}
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => moveInstruction(index, index - 1)}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Przesuń w górę"
                            >
                                <GripVertical className="w-4 h-4 rotate-90" />
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {instructions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>Brak instrukcji. Kliknij "Dodaj krok" aby rozpocząć.</p>
                </div>
            )}
        </div>
    )
}

export default InstructionInput
