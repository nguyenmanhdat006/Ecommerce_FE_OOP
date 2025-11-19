import SeactionHeading from "../SectionsHeading/SeactionHeading.jsx";
import Card from "../../Card/Card.jsx";

const Categories = ({ title, data }) => {
  return (
    <>
      <SeactionHeading title={title} />

      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-6 
          px-4 
          sm:px-6 
          lg:px-8
        "
      >
        {data &&
          data.map((item, index) => (
            <Card
              key={index}
              description={item?.description}
              title={item?.title}
              imagePath={item?.image}
              actionArrow={true}
            />
          ))}
      </div>
    </>
  );
};

export default Categories;
