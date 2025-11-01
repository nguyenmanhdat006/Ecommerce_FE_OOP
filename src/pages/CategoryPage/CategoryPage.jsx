import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { CrudPageLayout } from "@/layout/CrudPageLayout/CrudPageLayout";
import { DataTable } from "@/components/DataTable/DataTable";
import Spinner from "@/components/Spinner/Spinner";
import {
  fetchCategories,
  deleteCategory,
  getCategory,
} from "@/store/categorySlice";
import AddCategoryForm from "@/forms/AddCategoryForm/AddCategoryForm";
import EditCategoryForm from "@/forms/EditCategoryForm/EditCategoryForm";
import CategoryDetail from "@/forms/CategoryDetail/CategoryDetail";
import { SidePanel } from "@/components/SidePanel";
import { ActionMenu } from "@/components/ActionMenu";

export function CategoryPage() {
  const dispatch = useDispatch();
  const categories = useSelector(
    (state) => state.categorySlice?.categories || []
  );
  const loading = useSelector((state) => state.categorySlice?.loading);
  const error = useSelector((state) => state.categorySlice?.error);
  const loaded = useSelector((state) => state.categorySlice?.loaded);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchCategories());
    }
  }, [dispatch, loaded]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error);
    }
  }, [error]);

  const handleDelete = async (item) => {
    if (!confirm("Delete this category? This action cannot be undone."))
      return;
    try {
      await dispatch(deleteCategory(item.id)).unwrap();
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const handleEdit = async (item) => {
    setSelectedId(item.id);
    try {
      await dispatch(getCategory(item.id)).unwrap();
      setEditOpen(true);
    } catch (err) {
      toast.error(err?.message || "Failed to load category");
    }
  };

  const handleView = async (item) => {
    setSelectedId(item.id);
    try {
      await dispatch(getCategory(item.id)).unwrap();
      setDetailOpen(true);
    } catch (err) {
      toast.error(err?.message || "Failed to load category");
    }
  };

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    dispatch(fetchCategories());
  };

  const handleEditSuccess = () => {
    setEditOpen(false);
    setSelectedId(null);
    dispatch(fetchCategories());
  };

  const categoryActions = [
    {
      label: "Edit",
      onClick: handleEdit,
    },
    {
      label: "View",
      onClick: handleView,
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "danger",
    },
  ];

  // Define columns inside component to access handlers via closure
  const categoryColumns = [
    {
      key: "code",
      header: "Code",
      width: "15%",
      render: (cat) => <span className="font-medium">{cat.code}</span>,
    },
    {
      key: "name",
      header: "Name",
      width: "25%",
      render: (cat) => <span className="font-medium">{cat.name}</span>,
    },
    {
      key: "description",
      header: "Description",
      render: (cat) => (
        <span className="text-sm text-muted-foreground">
          {cat.description || "-"}
        </span>
      ),
    },
    {
      key: "categoryTypes",
      header: "Category Types",
      width: "20%",
      render: (cat) => (
        <span className="text-sm text-muted-foreground">
          {cat.categoryTypes && cat.categoryTypes.length > 0
            ? `${cat.categoryTypes.length} type(s)`
            : "No types"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "60px",
      render: (cat) => <ActionMenu actions={categoryActions} item={cat} />,
    },
  ];

  const panels = [
    {
      key: "create",
      open: createOpen,
      onOpenChange: setCreateOpen,
      title: "Add Category",
      content: <AddCategoryForm onSuccess={handleCreateSuccess} />,
    },
    {
      key: "edit",
      open: editOpen,
      onOpenChange: setEditOpen,
      title: "Edit Category",
      content: selectedId && (
        <EditCategoryForm id={selectedId} onSuccess={handleEditSuccess} />
      ),
    },
    {
      key: "detail",
      open: detailOpen,
      onOpenChange: setDetailOpen,
      title: "Category Details",
      content: selectedId && <CategoryDetail id={selectedId} />,
    },
  ];

  return (
    <>
      {loading && <Spinner />}
      <CrudPageLayout
        title="Categories"
        actionText="Add Category"
        onAdd={() => setCreateOpen(true)}
      >
        <DataTable
          data={categories}
          columns={categoryColumns}
          showSelect={true}
        />

        {panels.map((panel) => (
          <SidePanel
            key={panel.key}
            open={panel.open}
            onOpenChange={panel.onOpenChange}
            title={panel.title}
          >
            {panel.content}
          </SidePanel>
        ))}
      </CrudPageLayout>
    </>
  );
}

