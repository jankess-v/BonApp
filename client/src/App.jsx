import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import {Toaster} from "react-hot-toast"
import {AuthProvider, useAuth} from "./context/AuthContext.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import Register from "./pages/Register.jsx"
import './App.css'
import PublicRecipes from "./pages/PublicRecipes.jsx";
import AddRecipe from "./pages/AddRecipe.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";


function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/home" element={<Home />} />
                        <Route path="/recipes" element={<PublicRecipes />} />
                        <Route path="/add-recipe" element={<AddRecipe />} />
                        <Route path="/recipe/:id" element={<RecipeDetail />} />
                        <Route path="/" element={<Navigate to="/home" replace />} />
                    </Routes>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 2000,
                            style: {
                                background: "#fff",
                                color: "#374151",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.75rem",
                                fontSize: "14px",
                                fontWeight: "500",
                            },
                            success: {
                                iconTheme: {
                                    primary: "#10b981",
                                    secondary: "#fff",
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: "#ef4444",
                                    secondary: "#fff",
                                },
                            },
                        }}
                    />
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
