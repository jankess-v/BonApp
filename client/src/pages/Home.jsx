import {useAuth} from "../context/AuthContext.jsx";
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx"
import HomeBanner from "../components/HomeBanner.jsx"
import QuickActions from "../components/QuickActions.jsx"
import RecommendedRecipes from "../components/RecommendedRecipes.jsx";

const Home = () => {
    const {logout, isAuthenticated} = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="flex h-full grow flex-col">
            <Navbar/>
            <HomeBanner/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <QuickActions/>
                <RecommendedRecipes/>
            </div>
        </div>
    );
};

export default Home;