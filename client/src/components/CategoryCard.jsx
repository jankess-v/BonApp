import { Link } from "react-router-dom";

const CategoryCard = ({ category, image }) => {
  return (
      <Link
          to={`/recipes?category=${encodeURIComponent(category)}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-200"
      >
        <div className="relative h-48">
          <img
              src={image}
              alt={`Kategoria: ${category}`}
              className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-medium text-gray-900">{category}</h3>
        </div>
      </Link>
  );
};

export default CategoryCard;