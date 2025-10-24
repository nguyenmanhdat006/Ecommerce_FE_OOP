import { TableHeader } from "./components/TableHeader";
import { ProductStats } from "./components/ProductStats";
import { ProductFilters } from "./components/ProductFilters";
import { DataTable } from "@/components/DataTable";
import { AppImages } from "@/constants/AppImages";
import { getStatusColor } from "@/ultils/getStatusColors";
import { Star, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sampleProducts = [
  {
    id: "1",
    name: "HP Pavilion 16.1 Inch Gaming Laptop",
    image: AppImages.modernLaptopWorkspace,
    price: 960.99,
    category: "Electronics",
    stock: 5,
    sku: "RCH45Q1A",
    rating: 4.9,
    status: "Active",
  },
  {
    id: "2",
    name: "Samsung SM-A21S Galaxy A21S",
    image: AppImages.modernSmartphone,
    price: 350,
    category: "Electronics",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Out Of Stock",
  },
  {
    id: "4",
    name: "Ultimate Ears Wonderboom Bluetooth Speaker",
    image: AppImages.audioSpeaker,
    price: 119.99,
    category: "Electronics",
    stock: 10,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Active",
  },
  {
    id: "5",
    name: "Canon Pixma TS3350 Multifunction Printer",
    image: AppImages.officePrinter,
    price: 439.5,
    category: "Electronics",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
  },
  {
    id: "6",
    name: "Canon 4000D 18-55 MM III (Canon Eurasia Guaranteed)",
    image: AppImages.vintageCameraStillLife,
    price: 49.5,
    category: "Beauty",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
  },
  {
    id: "7",
    name: "Lobwerk Lenovo Tab M10 TB-X605F",
    image: AppImages.modernTabletDisplay,
    price: 49.5,
    category: "Beauty",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
  },
  {
    id: "8",
    name: '2019 55" Q60R QLED 4K Quantum HDR Smart TV',
    image: AppImages.retroLivingRoomTv,
    price: 49.5,
    category: "Beauty",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
  },
]

const defaultColumns = [
  {
    key: "name",
    header: "Product Name",
    thClassName: "px-6 py-3 text-left text-sm font-semibold text-foreground",
    tdClassName: "px-6 py-4",
    width: "35%",
    render: (p) => (
      <div className="flex items-center gap-3">
        <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
        <span className="text-sm font-medium text-foreground">{p.name}</span>
      </div>
    ),
  },
  {
    key: "price",
    header: "Price",
    thClassName: "px-6 py-3 text-left text-sm font-semibold text-foreground",
    tdClassName: "px-6 py-4 text-sm text-foreground",
    width: "8%",
    render: (p) => <span>${p.price}</span>,
  },
  {
    key: "category",
    header: "Category",
    thClassName: "px-6 py-3 text-left text-sm font-semibold text-foreground",
    tdClassName: "px-6 py-4 text-sm text-foreground",
    render: (p) => <span>{p.category}</span>,
  },
  {
    key: "stock",
    header: "Stock",
    thClassName: "px-6 py-3 text-left text-sm font-semibold text-foreground",
    tdClassName: "px-6 py-4 text-sm text-foreground",
    render: (p) => <span>{p.stock}</span>,
  },
  {
    key: "sku",
    header: "SKU",
    thClassName: "px-6 py-3 text-left text-sm font-semibold text-foreground",
    tdClassName: "px-6 py-4 text-sm text-foreground",
    render: (p) => <span>{p.sku}</span>,
  },
  {
    key: "rating",
    header: "Rating",
    thClassName: "px-6 py-3 text-left text-sm font-semibold text-foreground",
    tdClassName: "px-6 py-4",
    render: (p) => (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm text-foreground">{p.rating}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    thClassName: "px-6 py-3 text-left text-sm font-semibold text-foreground",
    tdClassName: "px-6 py-4",
    render: (p) => <Badge className={getStatusColor(p.status)}>{p.status}</Badge>,
  },
  {
    key: "actions",
    header: "Actions",
    thClassName: "px-6 py-3 text-center text-sm font-semibold text-foreground",
    tdClassName: "px-6 py-4 text-center",
    width: "80px",
    render: () => (
      <Button variant="ghost" size="sm">
        <MoreVertical className="w-4 h-4" />
      </Button>
    ),
  },
]


export function ProductsPage() {
  return (
    <div className="p-8 space-y-6">
      <TableHeader title="Products" actionText="Add Product" onAdd={() => console.log("add")} />
      <ProductStats />
      <ProductFilters />
      <DataTable data={sampleProducts} columns={defaultColumns} showSelect={true}/>
    </div>
  );
}
