const HomeBanner = () => {
    return (
        <div className="relative h-80 mb-8 w-full">
            <img
                src="https://www.indonesia.travel/content/dam/indtravelrevamp/en/destinations/revisi-2020/revamp-image/food-indonesia/indonesianfood-header.jpg"
                alt="Cooking banner"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-100 flex items-center justify-center">
                <div className="text-center text-white p-4 rounded-lg backdrop-filter backdrop-contrast-90">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-black text-shadow-sm">
                        Witaj w BonApp!
                    </h1>
                    <p className="text-xl md:text-2xl max-w-2xl font-bold mx-auto text-shadow-black text-shadow-md">
                        Odkryj nowe przepisy, zarządzaj swoją spiżarnią i planuj zakupy z łatwością.
                    </p>
                </div>
            </div>
        </div>
    );
};
export default HomeBanner;