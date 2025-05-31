import { Link } from "react-router-dom";

const ActionCard = ({ icon, title, description, to }) => {
    return (
        <Link to={to} className="block text-center">
            <button className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center w-full cursor-pointer">
                <div className="text-2xl mb-2">{icon}</div>
                <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </button>
        </Link>
    );
};

export default ActionCard;