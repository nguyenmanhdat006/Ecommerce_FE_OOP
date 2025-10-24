import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Star, MoreVertical } from "lucide-react"
import { AppImages } from "@/constants/AppImages"

const products = [
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
    status: "Active",
  },
  {
    id: "3",
    name: "Schwaiger KH510S 513 Buegelkopfhoerer",
    image: AppImages.diversePeopleListeningHeadphones,
    price: 300,
    category: "Electronics",
    stock: 27,
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

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Out Of Stock":
      return "bg-yellow-100 text-yellow-800"
    case "Closed For Sale":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ProductsTable() {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="text-sm font-medium text-foreground">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">${product.price}</td>
                <td className="px-6 py-4 text-sm text-foreground">{product.category}</td>
                <td className="px-6 py-4 text-sm text-foreground">{product.stock}</td>
                <td className="px-6 py-4 text-sm text-foreground">{product.sku}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-foreground">{product.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
