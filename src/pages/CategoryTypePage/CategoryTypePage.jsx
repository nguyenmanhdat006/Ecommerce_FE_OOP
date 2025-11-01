import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { CrudPageLayout } from "@/layout/CrudPageLayout/CrudPageLayout";
import { DataTable } from "@/components/DataTable/DataTable";
import { MoreHorizontal } from "lucide-react";
import Spinner from "@/components/Spinner/Spinner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  fetchCategoryTypes,
  deleteCategoryType,
  getCategoryType,
} from "@/store/categoryTypeSlice";
import AddCategoryTypeForm from "@/forms/AddCategoryTypeForm/AddCategoryTypeForm";
import EditCategoryTypeForm from "@/forms/EditCategoryTypeForm/EditCategoryTypeForm";
import CategoryTypeDetail from "@/forms/CategoryTypeDetail/CategoryTypeDetail";

function ActionMenu({ categoryType, onEdit, onView, onDelete }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu((s) => !s);
        }}
        className="p-1 rounded hover:bg-muted"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {openMenu && (
        <div className="absolute right-0 mt-2 w-40 bg-background border rounded shadow z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(categoryType.id);
              setOpenMenu(false);
            }}
            className="w-full text-left px-3 py-2 hover:bg-muted"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(categoryType.id);
              setOpenMenu(false);
            }}
            className="w-full text-left px-3 py-2 hover:bg-muted"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(categoryType.id);
              setOpenMenu(false);
            }}
            className="w-full text-left px-3 py-2 hover:bg-muted text-red-500"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function CategoryTypePage() {
  const dispatch = useDispatch();
  const categoryTypes = useSelector(
    (state) => state.categoryTypeSlice?.categoryTypes || []
  );
  const loading = useSelector((state) => state.categoryTypeSlice?.loading);
  const error = useSelector((state) => state.categoryTypeSlice?.error);
  const loaded = useSelector((state) => state.categoryTypeSlice?.loaded);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchCategoryTypes());
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error);
    }
  }, [error]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this category type? This action cannot be undone."))
      return;
    try {
      await dispatch(deleteCategoryType(id)).unwrap();
      toast.success("Category type deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const handleEdit = async (id) => {
    setSelectedId(id);
    try {
      await dispatch(getCategoryType(id)).unwrap();
      setEditOpen(true);
    } catch (err) {
      toast.error(err?.message || "Failed to load category type");
    }
  };

  const handleView = async (id) => {
    setSelectedId(id);
    try {
      await dispatch(getCategoryType(id)).unwrap();
      setDetailOpen(true);
    } catch (err) {
      toast.error(err?.message || "Failed to load category type");
    }
  };

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    dispatch(fetchCategoryTypes());
  };

  const handleEditSuccess = () => {
    setEditOpen(false);
    setSelectedId(null);
    dispatch(fetchCategoryTypes());
  };

  // Define columns inside component to access handlers via closure
  const categoryTypeColumns = [
    {
      key: "code",
      header: "Code",
      width: "15%",
      render: (ct) => <span className="font-medium">{ct.code}</span>,
    },
    {
      key: "name",
      header: "Name",
      width: "25%",
      render: (ct) => <span className="font-medium">{ct.name}</span>,
    },
    {
      key: "description",
      header: "Description",
      render: (ct) => (
        <span className="text-sm text-muted-foreground">
          {ct.description || "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "60px",
      render: (ct) => (
        <ActionMenu
          categoryType={ct}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <>
      {loading && <Spinner />}
      <CrudPageLayout
        title="Category Types"
        actionText="Add Category Type"
        onAdd={() => setCreateOpen(true)}
      >
        <DataTable
          data={categoryTypes}
          columns={categoryTypeColumns}
          showSelect={true}
        />
      </CrudPageLayout>

      {/* Create Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Category Type</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <AddCategoryTypeForm onSuccess={handleCreateSuccess} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Category Type</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedId && (
              <EditCategoryTypeForm
                id={selectedId}
                onSuccess={handleEditSuccess}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Category Type Details</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedId && <CategoryTypeDetail id={selectedId} />}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

