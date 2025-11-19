import SvgFavourite from "../../components/common/SvgFavourite";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
const ProductCard = ({ id, title, description, price, discount, rating, brand, thumbnail, slug }) => {
  return (
    <div
      className="flex flex-col relative border rounded-lg bg-white
                 transition-transform duration-300 ease-out transform
                 hover:-translate-y-1 hover:shadow-lg"
    >
      <Link to={`/product/${slug}`}>
        <div className="overflow-hidden rounded-t-lg">
          <img
            className="h-[320px] w-[280px] cursor-pointer object-cover block"
            src={thumbnail}
            alt={title}
          />
        </div>
      </Link>

      <div className="flex justify-between items-center p-2">
        <div className="flex flex-col">
          <p className="text-[16px]">{title}</p>
          {description && (
            <p className="text-[12px] text-gray-600">{brand}</p>
          )}
        </div>
        <div>
          <p>${price}</p>
        </div>
      </div>

      <button
        onClick={() => console.log("Add to favourites")}
        className="absolute top-0 right-0 p-2"
      >
        <SvgFavourite />
      </button>
    </div>
  );
};

export default ProductCard;
