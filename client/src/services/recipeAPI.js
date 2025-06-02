import api from "./api"

export const recipeAPI = {
    // Pobieranie przepisów użytkownika
    getUserRecipes: async (params = {}) => {
        const response = await api.get("/recipes/myRecipes", { params })
        return response.data
    },

    // Pobieranie publicznych przepisów
    getPublicRecipes: async (params = {}) => {
        const response = await api.get("/recipes/public", { params })
        return response.data
    },

    // Pobieranie pojedynczego przepisu
    getRecipe: async (id) => {
        const response = await api.get(`/recipes/${id}`)
        return response.data
    },

    // Tworzenie nowego przepisu
    createRecipe: async (recipeData) => {
        const response = await api.post("/recipes", recipeData)
        return response.data
    },

    // Aktualizacja przepisu
    updateRecipe: async (id, recipeData) => {
        const response = await api.put(`/recipes/edit/${id}`, recipeData)
        return response.data
    },

    // Usuwanie przepisu
    deleteRecipe: async (id) => {
        const response = await api.delete(`/recipes/${id}`)
        return response.data
    },
}
