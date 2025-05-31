import {useAuth} from "../context/AuthContext.jsx";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import logo from "../assets/AppLogoBlack.png";

const Navbar = () => {
    const {logout, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/home");
    };

    return (
        <nav
            className="bg-white flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f2f2f2] px-10 py-3">
            <Link to="/home">
                <div className="flex items-center gap-4 text-[#141414]">
                    <div className="h-12 w-15">
                        <img src={logo} alt="BonApp logo"/>
                    </div>
                    <h2 className="text-[#141414] text-2xl font-bold leading-tight tracking-[-0.015em]">BonApp</h2>
                </div>
            </Link>

            <div className="hidden md:flex items-center gap-9 text-[#141414] text-xl font-medium">
                <Link to="/recipes"><p className="cursor-pointer">Przepisy</p></Link>
                <Link to="/pantry"><p className="cursor-pointer">Spiżarnia</p></Link>
                <Link to="/shopping-list"><p className="cursor-pointer">Lista zakupów</p></Link>
            </div>

            {/*Przyciski*/}
            <div className="flex items-center gap-2">
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm cursor-pointer">
                        Wyloguj się
                    </button>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="px-3 py-1 bg-indigo-600 text-white rounded-md mr-2 hover:bg-indigo-700 transition-colors duration-200 text-sm cursor-pointer">
                                Zaloguj się
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm cursor-pointer">
                                Zarejestruj się
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;