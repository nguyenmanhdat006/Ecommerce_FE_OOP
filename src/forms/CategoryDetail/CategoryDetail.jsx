import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "@/store/categorySlice";
import Spinner from "@/components/Spinner/Spinner";

export default function CategoryDetail({ id }) {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.categorySlice?.selectedCategory
  );
  const loading = useSelector((state) => state.categorySlice?.loading);

  useEffect(() => {
    if (id) {
      dispatch(getCategory(id));
    }
  }, [id, dispatch]);

  if (loading || !selectedCategory || selectedCategory.id !== id) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Code
          </label>
          <div className="px-3 py-2 bg-muted rounded-md font-medium">
            {selectedCategory.code}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Name
          </label>
          <div className="px-3 py-2 bg-muted rounded-md font-medium">
            {selectedCategory.name}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Description
          </label>
          <div className="px-3 py-2 bg-muted rounded-md min-h-[80px]">
            {selectedCategory.description || (
              <span className="text-muted-foreground italic">No description</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Category Types
          </label>
          <div className="px-3 py-2 bg-muted rounded-md min-h-[60px]">
            {selectedCategory.categoryTypes && selectedCategory.categoryTypes.length > 0 ? (
              <div className="space-y-2">
                {selectedCategory.categoryTypes.map((ct, index) => (
                  <div
                    key={ct.id || index}
                    className="px-2 py-1 bg-background rounded text-sm"
                  >
                    <span className="font-medium">{ct.name}</span>
                    {ct.code && (
                      <span className="text-muted-foreground ml-2">
                        ({ct.code})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground italic">
                No category types assigned
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            ID
          </label>
          <div className="px-3 py-2 bg-muted rounded-md text-xs font-mono text-muted-foreground">
            {selectedCategory.id}
          </div>
        </div>
      </div>
    </div>
  );
}

