import SvgFavourite from "../../components/common/SvgFavourite";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
const ProductCard = ({ id, title, description, price, discount, rating, brand, thumbnail, slug }) => {
  return (
    <div
      className="flex flex-col relative border rounded-lg bg-white
                 transition-transform duration-300 ease-out transform
                 hover:-translate-y-1 hover:shadow-sm overflow-hidden"
    >
      <Link to={`/product/${slug}`}>
        <div className="relative w-full pt-[125%] overflow-hidden rounded-t-lg bg-gray-100">
          <img
            className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer
                       transition-transform duration-300 hover:scale-105"
            src={thumbnail}
            alt={title}
          />
        </div>
      </Link>

      <div className="flex justify-between items-center p-3 gap-2">
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-[14px] sm:text-[16px] font-medium truncate" title={title}>
            {title}
          </p>
          {brand && (
            <p className="text-[12px] text-gray-600 truncate">{brand}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <p className="text-[14px] sm:text-[16px] font-semibold text-gray-900">
            ${price}
          </p>
        </div>
      </div>

      <button
        onClick={() => console.log("Add to favourites")}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md
                   hover:bg-gray-100 transition-colors duration-200"
        aria-label="Add to favourites"
      >
        <SvgFavourite />
      </button>
    </div>
  );
};

export default ProductCard;