import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { CrudPageLayout } from "@/layout/CrudPageLayout/CrudPageLayout";
import { DataTable } from "@/components/DataTable/DataTable";
import Spinner from "@/components/Spinner/Spinner";
import {
  fetchCategoryTypes,
  deleteCategoryType,
  getCategoryType,
} from "@/store/categoryTypeSlice";
import AddCategoryTypeForm from "@/forms/AddCategoryTypeForm/AddCategoryTypeForm";
import EditCategoryTypeForm from "@/forms/EditCategoryTypeForm/EditCategoryTypeForm";
import CategoryTypeDetail from "@/forms/CategoryTypeDetail/CategoryTypeDetail";
import { SidePanel } from "@/components/SidePanel";
import { ActionMenu } from "@/components/ActionMenu";

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
  }, [dispatch, loaded]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error);
    }
  }, [error]);

  const handleDelete = async (item) => {
    if (!confirm("Delete this category type? This action cannot be undone."))
      return;
    try {
      await dispatch(deleteCategoryType(item.id)).unwrap();
      toast.success("Category type deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const handleEdit = async (item) => {
    setSelectedId(item.id);
    try {
      await dispatch(getCategoryType(item.id)).unwrap();
      setEditOpen(true);
      console.log("Edit open: ", editOpen);
    } catch (err) {
      toast.error(err?.message || "Failed to load category type");
    }
  };

  const handleView = async (item) => {
    setSelectedId(item.id);
    try {
      await dispatch(getCategoryType(item.id)).unwrap();
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

  const categoryTypeActions = [
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
      render: (ct) => <ActionMenu actions={categoryTypeActions} item={ct} />,
    },
  ];

  const panels = [
    {
      key: "create",
      open: createOpen,
      onOpenChange: setCreateOpen,
      title: "Add Category Type",
      content: <AddCategoryTypeForm onSuccess={handleCreateSuccess} />,
    },
    {
      key: "edit",
      open: editOpen,
      onOpenChange: setEditOpen,
      title: "Edit Category Type",
      content: selectedId && (
        <EditCategoryTypeForm id={selectedId} onSuccess={handleEditSuccess} />
      ),
    },
    {
      key: "detail",
      open: detailOpen,
      onOpenChange: setDetailOpen,
      title: "Category Type Details",
      content: selectedId && <CategoryTypeDetail id={selectedId} />,
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
