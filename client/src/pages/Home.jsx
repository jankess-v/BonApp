import {useAuth} from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx"
import HomeBanner from "../components/HomeBanner.jsx"
import QuickActions from "../components/QuickActions.jsx"
import RecommendedCategories from "../components/RecommendedCategories.jsx";

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex h-full grow flex-col">
            <Navbar/>
            <HomeBanner/>
            <div className="w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <QuickActions/>
                <RecommendedCategories />
            </div>
        </div>
    );
};

export default Home;