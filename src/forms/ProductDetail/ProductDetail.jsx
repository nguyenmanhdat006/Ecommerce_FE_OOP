"use client"

import { QRCodeCanvas } from "qrcode.react";
import { useState, useEffect } from "react";
import { Search, Settings, Download, Plus, Info, MoreVertical } from "lucide-react";
import { formatCurrency } from "@/utils/currencyFormatter";

// ==== Component cơ bản ====
function Button({ children, className = "", variant, size, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100",
  }
  return (
    <button className={`${base} ${variants[variant] || ""} ${className}`} {...props}>
      {children}
    </button>
  )
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  )
}

function Card({ children, className = "" }) {
  return <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>
}

function Avatar({ children, className = "" }) {
  return <div className={`rounded-full overflow-hidden ${className}`}>{children}</div>
}

function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover" />
}

function AvatarFallback({ children }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-sm font-medium">
      {children}
    </div>
  )
}

// ==== Table ====
function Table({ children }) {
  return <table className="w-full border-collapse">{children}</table>
}
function TableHeader({ children }) {
  return <thead className="bg-gray-100">{children}</thead>
}
function TableBody({ children }) {
  return <tbody>{children}</tbody>
}
function TableRow({ children, className = "" }) {
  return <tr className={`border-b ${className}`}>{children}</tr>
}
function TableHead({ children, className = "" }) {
  return <th className={`text-left px-4 py-2 text-sm font-semibold text-gray-700 ${className}`}>{children}</th>
}
function TableCell({ children, className = "" }) {
  return <td className={`px-4 py-2 text-sm text-gray-600 ${className}`}>{children}</td>
}

// ==== ProductTable ====
function ProductTable({ searchTerm }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Ẩn dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll(".dropdown-menu");
      let clickedInside = false;
      dropdowns.forEach((el) => {
        if (el.contains(event.target)) clickedInside = true;
      });
      if (!clickedInside) setSelectedProduct(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const products = [
    {
      id: "P001",
      name: "Túi Xách Da Cao Cấp",
      description: "Da thật 100%, thiết kế sang trọng",
      price: 1500000,
      quantity: 120,
      color: "Đen",
      style: "Nâu",
      sku: "978-604-80-01",
      image: "🎒",
      year: 2023,
      manufacturer: "Công ty TNHH Thời Trang Việt",
      statusDetail: "Còn hàng",
    },
    {
      id: "P002",
      name: "Áo Thun Cotton",
      description: "Chất liệu cotton mềm mại",
      price: 250000,
      quantity: 30,
      color: "Trắng",
      style: "Xám",
      sku: "978-604-80-02",
      image: "👕",
      year: 2022,
      manufacturer: "Công ty May Mặc Bình Minh",
      statusDetail: "Còn hàng",
    },
    {
      id: "P003",
      name: "Lều Cắm Trại 4 Người",
      description: "Chống thấm nước tuyệt đối",
      price: 3200000,
      quantity: 0,
      color: "Xanh lá",
      style: "Du lịch",
      sku: "978-604-80-03",
      image: "⛺",
      status: "Hết hàng",
      year: 2021,
      manufacturer: "Công ty Dã Ngoại Việt",
      statusDetail: "Hết hàng",
    },
    {
      id: "P004",
      name: "Áo khoác gió",
      description: "Chống thấm nước, phù hợp cho mọi thời tiết",
      price: 1500000,
      quantity: 75,
      color: "Xanh dương, Xanh than, Đen, Trắng",
      style: "Thể thao",
      sku: "978-604-80-04",
      image: "🧥",
      year: 2024,
      manufacturer: "Thời Trang Việt Sport",
      statusDetail: "Còn hàng",
    },
    {
      id: "P005",
      name: "Giày Thể Thao Chạy Bộ",
      description: "Đệm lót êm ái, thiết kế thời trang",
      price: 1200000,
      quantity: 50,
      color: "Đen, Trắng",
      style: "Thể thao",
      sku: "978-604-80-05",
      image: "👟",
      year: 2023,
      manufacturer: "Công ty Giày Việt Nam",
      statusDetail: "Còn hàng",
    },
    {
      id: "P006",
      name: "Đồng Hồ Thông Minh",
      description: "Theo dõi sức khỏe và thông báo thông minh",
      price: 2200000,
      quantity: 20,
      color: "Đen, Bạc",
      style: "Công nghệ",
      sku: "978-604-80-06",
      image: "⌚",
      year: 2023,
      manufacturer: "SmartTech Việt",
      statusDetail: "Còn hàng",
    },
    {
      id: "P007",
      name: "Balo Du Lịch",
      description: "Chất liệu chống nước, nhiều ngăn tiện lợi",
      price: 800000,
      quantity: 0,
      color: "Xám, Đen",
      style: "Du lịch",
      sku: "978-604-80-07",
      image: "🎒",
      status: "Hết hàng",
      year: 2021,
      manufacturer: "Công ty BaloPro",
      statusDetail: "Hết hàng",
    },
    {
      id: "P008",
      name: "Kính Mát Thời Trang",
      description: "Chống tia UV, thiết kế hiện đại",
      price: 500000,
      quantity: 100,
      color: "Đen, Nâu",
      style: "Thời trang",
      sku: "978-604-80-08",
      image: "🕶️",
      year: 2022,
      manufacturer: "SunGlasses Co.",
      statusDetail: "Còn hàng",
    },
  ];

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* POPUP CHI TIẾT */}
      {isDetailOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-3/4 max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
            <p className="text-gray-700 mb-2">🆔 Mã sản phẩm: {selectedProduct.id}</p>
            <p className="text-gray-700 mb-2">🏭 Nhà sản xuất: {selectedProduct.manufacturer}</p>
            <p className="text-gray-700 mb-2">📅 Năm sản xuất: {selectedProduct.year}</p>
            <p className="text-gray-700 mb-2">📦 Tình trạng: {selectedProduct.statusDetail}</p>
            <p className="text-gray-700 mb-4">📝 Mô tả: {selectedProduct.description}</p>
            <p className="text-gray-700 mb-4">
              💰 Giá: {formatCurrency(selectedProduct.price)}
            </p>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* BẢNG SẢN PHẨM */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Hình</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Giá</TableHead>
                <TableHead className="text-right">Số lượng</TableHead>
                <TableHead>Màu</TableHead>
                <TableHead>Kiểu</TableHead>
                <TableHead>Mã vạch</TableHead>
                <TableHead>QR</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="text-2xl">{product.image}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>{product.quantity}</span>
                      {product.status && (
                        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">
                          {product.status}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.color}</TableCell>
                  <TableCell>{product.style}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <QRCodeCanvas
                      value={`${window.location.origin}/qr?id=${product.id}`}
                      size={60}
                    />
                  </TableCell>

                  {/* Dropdown chi tiết */}
                  <TableCell>
                    <div className="relative inline-block text-left dropdown-menu">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setSelectedProduct(selectedProduct?.id === product.id ? null : product)
                        }
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>

                      {selectedProduct?.id === product.id && (
                        <div className="absolute right-0 mt-2 w-24 bg-white border rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              setIsDetailOpen(true);
                              setSelectedProduct(product);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Chi tiết
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
}

// ==== InventoryPage ====
export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const stats = [
    { label: "Tổng sản phẩm", value: "8", description: "Tổng số mặt hàng trong kho", icon: "📦" },
    { label: "Còn hàng", value: "6", description: "Sản phẩm sẵn sàng bán", icon: "✅" },
    { label: "Tồn kho thấp", value: "0", description: "Cần nhập thêm hàng", icon: "⚠️" },
    { label: "Hết hàng", value: "2", description: "Không còn sản phẩm", icon: "❌" },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 overflow-auto">
        <header className="border-b bg-white p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Xuất dữ liệu
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">Tổng quan sản phẩm</h1>
            <div className="grid grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-500">{s.label}</span>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{s.value}</div>
                  <p className="text-xs text-gray-500">{s.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm sản phẩm mới
              </Button>
            </div>
            <ProductTable searchTerm={searchTerm} />
          </div>
        </div>
      </main>
    </div>
  )
}
