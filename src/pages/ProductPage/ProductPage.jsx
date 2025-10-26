import { ProductStats } from "./components/ProductStats";
import { FilterBar } from "../../layout/CrudPageLayout/FilterBar";
import { DataTable } from "@/components/DataTable/DataTable";
import { Star, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CrudPageLayout } from "@/layout/CrudPageLayout/CrudPageLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import { useEffect } from "react";
import Spinner from "@/components/Spinner/Spinner";
import { toast } from "react-hot-toast";


// eslint-disable-next-line no-unused-vars
const sampleProducts = [
  {
    "id": "1ee2d566-52ef-4cbb-aefa-77cf4b028c71",
    "name": "Adidas Ultraboost 22",
    "description": "Giày chạy bộ hiệu suất cao, đàn hồi tốt.",
    "price": 3299000,
    "brand": "Adidas",
    "rating": 4.7,
    "categoryId": "af733a18-f471-48f9-bb92-68265a8a3a8c",
    "thumbnail": "https://images.adidas.com/ultraboost22.jpg",
    "slug": "adidas-ultraboost-22",
    "categoryName": "Shoes",
    "categoryTypeId": "84fe4ce7-86f0-415d-b987-1e02421e08e8",
    "categoryTypeName": "Running",
    "variants": [
      {
        "id": "d77ab6cf-5f75-42fb-a913-26632127c925",
        "color": "Blue",
        "size": "42",
        "stockQuantity": 8
      }
    ],
    "productResources": [
      {
        "id": "671ceeb8-f0fd-4932-8238-dd5d52e4b761",
        "name": "Thumbnail",
        "url": "https://images.adidas.com/ultraboost22-main.jpg",
        "type": "image",
        "isPrimary": true
      }
    ],
    "newArrival": false
  },
  {
    "id": "892b7426-338b-4dae-a949-1d3f86114e47",
    "name": "Converse Chuck 70",
    "description": "Thiết kế cổ điển, phù hợp mọi outfit.",
    "price": 1599000,
    "brand": "Converse",
    "rating": 4.3,
    "categoryId": "9f4044fe-9103-41bb-bcf2-b09b70a41bc0",
    "thumbnail": "https://images.converse.com/chuck70.jpg",
    "slug": "converse-chuck-70",
    "categoryName": "Shoes",
    "categoryTypeId": "84fe4ce7-86f0-415d-b987-1e02421e08e8",
    "categoryTypeName": "Classic",
    "variants": [
      {
        "id": "98cf4a97-3e23-4e52-b4a8-cf53f5130911",
        "color": "White",
        "size": "41",
        "stockQuantity": 12
      }
    ],
    "productResources": [
      {
        "id": "c73c088a-b8ea-4ddf-a01b-340374b04632",
        "name": "Thumbnail",
        "url": "https://images.converse.com/chuck70-main.jpg",
        "type": "image",
        "isPrimary": true
      }
    ],
    "newArrival": true
  }
]


const productColumns = [
  {
    key: "thumbnail",
    header: "Thumbnail",
    width: "50px",
    render: (p) => (
      <img
        src={p.thumbnail}
        alt={p.name}
        className="w-10 h-10 rounded object-cover"
      />
    ),
  },
  {
    key: "name",
    header: "Product Name",
    width: "25%",
    render: (p) => <span className="font-medium">{p.name}</span>,
  },
  {
    key: "brand",
    header: "Brand",
    render: (p) => <span className="text-sm">{p.brand}</span>,
  },
  {
    key: "categoryName",
    header: "Category",
    render: (p) => <span className="text-sm">{p.categoryName}</span>,
  },
  {
    key: "price",
    header: "Price",
    render: (p) => <span>${p.price.toLocaleString()}</span>,
  },
  {
    key: "stock",
    header: "Stock",
    render: (p) => {
      const totalStock = p.variants?.reduce(
        (acc, v) => acc + (v.stockQuantity || 0),
        0
      );
      return <span>{totalStock}</span>;
    },
  },
  {
    key: "rating",
    header: "Rating",
    render: (p) => (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span>{p.rating}</span>
      </div>
    ),
  },
  {
    key: "newArrival",
    header: "New",
    render: (p) =>
      p.newArrival ? (
        <Badge className="bg-green-500 text-white">New</Badge>
      ) : (
        <Badge variant="outline">Old</Badge>
      ),
  },
  {
    key: "slug",
    header: "Slug",
    render: (p) => (
      <span className="text-xs text-muted-foreground">{p.slug}</span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    width: "60px",
    render: () => (
      <Button variant="ghost" size="sm">
        <MoreVertical className="w-4 h-4" />
      </Button>
    ),
  },
];


const productFilters = [
  {
    key: "status",
    placeholder: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
    onChange: (key, value) => {
      console.log("status:", key, value);
      // TODO: Implement filter logic
    },
  },
  {
    key: "category",
    placeholder: "Category",
    options: [
      { value: "electronics", label: "Electronics" },
      { value: "beauty", label: "Beauty" },
    ],
    onChange: (key, value) => console.log("category:", key, value),
  },
  {
    key: "price",
    placeholder: "Price Range",
    options: [
      { value: "0-100", label: "$0 - $100" },
      { value: "100-200", label: "$100 - $200" },
      { value: "200-500", label: "$200 - $500" },
    ],
    onChange: (key, value) => console.log("price:", key, value),
  },
];

const onSearch = (v) => {
  console.log("search:", v);
  // TODO: Implement search logic
  // Call API Theo Entity vì search chì nhận value
};

const onClear = () => {
  console.log("clear");
  // TODO: Implement clear logic
};

export function ProductsPage() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.productSlice.products);
  const loading = useSelector((state) => state.productSlice.loading);
  const error = useSelector((state) => state.productSlice.error);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
    {loading && <Spinner />}
    {error && toast.error(error)}
    {products.length > 0 && (
      <CrudPageLayout
        title="Products"
        actionText="Add Product"
        onAdd={() => console.log("add")}
        stats={<ProductStats />}
        filters={
          <FilterBar
            filters={productFilters}
            onSearch={onSearch}
            onClear={onClear}
          />
        }
      >
        <DataTable
          data={products}
          columns={productColumns}
          showSelect={true}
        />
      </CrudPageLayout>
    )}
    </>
  );
}
