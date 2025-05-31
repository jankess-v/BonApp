import {useAuth} from "../context/AuthContext.jsx";
import ActionCard from "./ActionCard.jsx";


const QuickActions = () => {
    const {isAuthenticated} = useAuth();
    return (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 max-w-7xl mx-auto w-full">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Szybkie akcje
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard
                    icon="📝"
                    title="Dodaj przepis"
                    description={isAuthenticated ? "Stwórz własny przepis" : "Zaloguj się, aby dodać przepis"}
                    to={isAuthenticated ? "/add-recipe" : "/login"}
                />

                <ActionCard
                    icon="🥫"
                    title="Sprawdź spiżarnię"
                    description={isAuthenticated ? "Zobacz co masz w domu" : "Zaloguj się, aby dodać przepis"}
                    to={isAuthenticated ? "/pantry" : "/login"}
                />

                <ActionCard
                    icon="🛒"
                    title="Lista zakupów"
                    description={isAuthenticated ? "Planuj swoje zakupyu" : "Zaloguj się, aby dodać przepis"}
                    to={isAuthenticated ? "/shopping-list" : "/login"}
                />
            </div>
        </section>
    );
};

export default QuickActions;