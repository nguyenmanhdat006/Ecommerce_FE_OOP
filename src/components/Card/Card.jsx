import ArrowIcon from "../common/ArrowIcon";

const Card = ({
  imagePath,
  title,
  description,
  actionArrow,
  height,
  width,
}) => {
  return (
    <div className="flex flex-col p-4 sm:p-6 w-full">
      <div className="w-full overflow-hidden rounded-lg">
        <img
          className="
            border rounded-lg 
            hover:scale-105 
            transition-transform 
            duration-300 
            cursor-pointer 
            object-cover 
            object-top
            w-full 
            h-[180px] 
            sm:h-[220px] 
            md:h-[250px]
          "
          style={{ objectPosition: "50% 15%" }}
          src={imagePath}
          alt={title}
        />
      </div>

      <div className="flex justify-between items-start mt-3">
        <div className="flex flex-col">
          <p className="text-sm sm:text-base font-medium">{title}</p>
          {description && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {description}
            </p>
          )}
        </div>

        {actionArrow && (
          <span className="cursor-pointer pl-3 flex items-center">
            <ArrowIcon />
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
