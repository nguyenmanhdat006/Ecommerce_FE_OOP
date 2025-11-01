import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryType } from "@/store/categoryTypeSlice";
import { fetchCategories } from "@/store/categorySlice";
import Spinner from "@/components/Spinner/Spinner";

export default function CategoryTypeDetail({ id }) {
  const dispatch = useDispatch();
  const selectedCategoryType = useSelector(
    (state) => state.categoryTypeSlice?.selectedCategoryType
  );
  const loading = useSelector((state) => state.categoryTypeSlice?.loading);
  const categories = useSelector(
    (state) => state.categorySlice?.categories || []
  );
  const loaded = useSelector((state) => state.categorySlice?.loaded);
  useEffect(() => {
    if (!loaded) {
      dispatch(fetchCategories());
    }
    if (id) {
      dispatch(getCategoryType(id));
    }
  }, [id, dispatch, loaded]);

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryType?.categoryId
  );

  if (loading || !selectedCategoryType || selectedCategoryType.id !== id) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Category
          </label>
          <div className="px-3 py-2 bg-muted rounded-md font-medium">
            {selectedCategory?.name || (
              <span className="text-muted-foreground italic">
                {selectedCategoryType.categoryId || "No category"}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Code
          </label>
          <div className="px-3 py-2 bg-muted rounded-md font-medium">
            {selectedCategoryType.code}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Name
          </label>
          <div className="px-3 py-2 bg-muted rounded-md font-medium">
            {selectedCategoryType.name}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Description
          </label>
          <div className="px-3 py-2 bg-muted rounded-md min-h-[80px]">
            {selectedCategoryType.description || (
              <span className="text-muted-foreground italic">No description</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            ID
          </label>
          <div className="px-3 py-2 bg-muted rounded-md text-xs font-mono text-muted-foreground">
            {selectedCategoryType.id}
          </div>
        </div>
      </div>
    </div>
  );
}

