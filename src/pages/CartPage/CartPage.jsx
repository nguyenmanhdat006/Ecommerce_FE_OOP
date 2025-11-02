import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import { cartAPI } from "@/api/cart.api";
import { getUser } from "@/utils/jwt-helper";
import { useNavigate } from "react-router-dom"; 

const formatVND = (n) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// Mock data cho phần "Có thể bạn cũng thích"
const recommendations = [
  {
    id: 1,
    name: "Quạt mini cầm tay M2 5000mAh di động",
    price: 39900,
    sold: "Đã bán 20k+",
    discount: "-29%",
    rating: 4.6,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lr2r3fl6m7up26",
  },
  {
    id: 2,
    name: "Loa Bluetooth hát karaoke mini",
    price: 38000,
    sold: "Đã bán 1k+",
    discount: "-3%",
    rating: 4.6,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqzmyfsyc8f812",
  },
  {
    id: 3,
    name: "Lược chải tóc mát xa da đầu",
    price: 11695,
    sold: "Đã bán 10k+",
    discount: "-42%",
    rating: 4.8,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqzmyzxy5hcx7a",
  },
  {
    id: 4,
    name: "Ốp lưng iPhone Hello Kitty",
    price: 2920,
    sold: "Đã bán 8k+",
    discount: "-37%",
    rating: 4.7,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqzmyzxy5hcx7b",
  },
  {
    id: 5,
    name: "Máy massage mini cầm tay",
    price: 30000,
    sold: "Đã bán 5k+",
    discount: "-14%",
    rating: 4.8,
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqzmyzxy5hcx7c",
  },
];

export default function ShopeeCartPage() {
  const [products, setProducts] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ thêm dòng này

  // --- Load cart từ BE ---
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const currentUser = getUser();
        const res = await cartAPI.getUserCarts();
        const filtered = Array.isArray(res)
          ? res.filter((c) => currentUser && c.userId === currentUser.id)
          : [];

        const mapped = filtered.map((c) => ({
          id: c.id,
          name: c.product?.name || "Sản phẩm",
          price: c.product?.price || 0,
          qty: c.quantity || 1,
          shop: c.product?.brand || "Coolmate - Official Store",
          img: c.product?.thumbnail || "https://via.placeholder.com/120",
          size: c.productVariant?.size || "-",
          color: c.productVariant?.color || "-",
        }));
        setProducts(mapped);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const updateQty = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p
      )
    );
  };

  const remove = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const total = products
    .filter((p) => checkedItems.includes(p.id))
    .reduce((s, p) => s + p.price * p.qty, 0);

  const handleCheckout = () => {
    const selected = products.filter((p) => checkedItems.includes(p.id));
    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
      return;
    }

    localStorage.setItem("checkoutItems", JSON.stringify(selected));
    navigate("/checkout");
  };

  if (loading) return <p className="text-center mt-10">Đang tải giỏ hàng...</p>;

  return (
    <div className="bg-[#f5f5f5] py-6">
      <div className="max-w-6xl mx-auto">
        {/* --- CART ITEMS --- */}
        {products.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-md mb-6 shadow-sm border"
          >
            {/* --- Header Shop --- */}
            <div className="flex items-center justify-between px-4 py-3 border-b text-sm">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={checkedItems.includes(p.id)}
                  onCheckedChange={() => toggleCheck(p.id)}
                />
                <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-sm font-semibold">
                  Mall
                </span>
                <span className="font-semibold">{p.shop}</span>
                <MessageCircle
                  size={16}
                  className="text-gray-500 cursor-pointer hover:text-orange-500"
                />
              </div>
            </div>

            {/* --- Mua kèm --- */}
            <div className="bg-[#fff3ec] px-4 py-2 text-sm text-gray-600 border-b">
              <span className="text-red-500 font-medium">Mua Kèm</span> Mua tối
              thiểu <span className="font-semibold">349.000₫</span> để nhận quà
              <Button
                variant="link"
                className="text-orange-500 font-medium ml-1 p-0 h-auto"
              >
                Mua thêm &gt;
              </Button>
            </div>

            {/* --- Product Info --- */}
            <div className="flex items-center px-4 py-4 border-b">
              <Checkbox
                checked={checkedItems.includes(p.id)}
                onCheckedChange={() => toggleCheck(p.id)}
              />
              <img
                src={p.img}
                alt={p.name}
                className="w-20 h-24 object-cover rounded-md mx-3"
              />
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">{p.name}</div>
                <div className="text-xs text-gray-500">
                  Phân loại hàng: {p.color}, {p.size}
                </div>
              </div>
              <div className="text-center w-32">
                <div className="text-gray-400 line-through text-sm">
                  {formatVND(p.price * 1.1)}
                </div>
                <div className="text-red-500 font-semibold">
                  {formatVND(p.price)}
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 w-32">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQty(p.id, -1)}
                >
                  <Minus size={14} />
                </Button>
                <Input
                  readOnly
                  value={p.qty}
                  className="w-12 text-center h-8"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQty(p.id, +1)}
                >
                  <Plus size={14} />
                </Button>
              </div>
              <div className="w-40 text-right">
                <div className="text-red-500 font-semibold mb-1">
                  {formatVND(p.price * p.qty)}
                </div>
                <Button
                  variant="link"
                  className="text-red-500 text-sm p-0"
                  onClick={() => remove(p.id)}
                >
                  Xóa
                </Button>
                <div className="text-xs text-orange-500 cursor-pointer hover:underline">
                  Tìm sản phẩm tương tự
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* --- Tổng cộng --- */}
        <div className="flex justify-between items-center bg-white px-6 py-4 rounded-md shadow-sm border mt-6">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={checkedItems.length === products.length}
              onCheckedChange={() =>
                setCheckedItems(
                  checkedItems.length === products.length
                    ? []
                    : products.map((p) => p.id)
                )
              }
            />
            <span className="text-sm text-gray-700">Chọn tất cả</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500"
              onClick={() => setProducts([])}
            >
              Xóa
            </Button>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600">
              Tổng cộng ({checkedItems.length} sản phẩm):{" "}
              <span className="text-xl text-orange-500 font-bold">
                {formatVND(total)}
              </span>
            </div>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white mt-2 px-10"
              onClick={handleCheckout} // ✅ chỉ thêm dòng này
            >
              Mua hàng
            </Button>
          </div>
        </div>

        {/* --- Có thể bạn cũng thích --- */}
        <div className="bg-white rounded-md shadow-sm border mt-10 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              CÓ THỂ BẠN CŨNG THÍCH
            </h2>
            <Button variant="link" className="text-red-500 p-0">
              Xem Tất Cả &gt;
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className="border rounded-md overflow-hidden hover:shadow-md transition bg-white cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-44 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm line-clamp-2">{item.name}</p>
                  <p className="text-orange-500 font-semibold">
                    {formatVND(item.price)}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.discount}</span>
                    <span>{item.sold}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
