import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { cartAPI } from '@/api/cart.api';
import { getUser } from '@/utils/jwt-helper';

// Utils
const formatVND = (n) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function ShopeeCartPage() {
  const [view, setView] = useState("compact"); // compact | grid | drawer

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentUser = getUser();
        const res = await cartAPI.getUserCarts();
        // res is expected to be an array of cart items from backend
        const filtered = Array.isArray(res)
          ? res.filter((c) => currentUser && c.userId === currentUser.id)
          : [];

        // map backend shape to UI product shape
        const mapped = filtered.map((c) => ({
          id: c.id,
          name: c.product?.name || "Unknown",
          price: Math.round((c.product?.price ?? 0) * 1000) / 1000 || c.product?.price || 0,
          qty: c.quantity || 1,
          shop: c.product?.brand || "",
          img: c.product?.thumbnail || "https://via.placeholder.com/96",
          size: null,
          color: null,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Không thể tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);
  const updateQty = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p))
    );
  };

  const remove = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const total = products.reduce((s, p) => s + p.price * p.qty, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-3">
          <ShoppingCart className="h-6 w-6" /> Giỏ hàng của bạn
        </h1>
        <div className="flex items-center gap-2">
          <Select onValueChange={(v) => setView(v)} defaultValue={view}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Chọn kiểu hiển thị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Danh sách (Compact)</SelectItem>
              <SelectItem value="grid">Card (Grid)</SelectItem>
              <SelectItem value="drawer">Drawer / Mobile</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => alert("Checkout giả lập")}>Thanh toán</Button>
        </div>
      </header>

      <main>
        {view === "compact" && <CompactList products={products} updateQty={updateQty} remove={remove} />}
        {view === "grid" && <GridCards products={products} updateQty={updateQty} remove={remove} />}
        {view === "drawer" && <DrawerStyle products={products} updateQty={updateQty} remove={remove} total={total} />}
      </main>

      <footer className="mt-8 flex justify-end">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Tổng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>Tổng tiền ({products.length} sản phẩm)</div>
              <div className="font-semibold">{formatVND(total)}</div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={() => alert("Checkout giả lập")} className="flex-1">
              <CreditCard className="mr-2" /> Mua hàng
            </Button>
          </CardFooter>
        </Card>
      </footer>
    </div>
  );
}

function CompactList({ products, updateQty, remove }) {
  return (
    <div className="space-y-4">
      {products.map((p) => (
        <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-center bg-white p-3 rounded-lg shadow-sm">
          <Checkbox />
          <Avatar>
            <img src={p.img} alt={p.name} className="rounded-md" />
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-muted-foreground">{p.shop} • {p.size ? `Size ${p.size}` : p.color}</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => updateQty(p.id, -1)}><Minus /></Button>
                <Input readOnly value={p.qty} className="w-12 text-center" />
                <Button variant="outline" size="sm" onClick={() => updateQty(p.id, +1)}><Plus /></Button>
              </div>
              <div className="ml-auto font-semibold">{formatVND(p.price)}</div>
              <Button variant="ghost" onClick={() => remove(p.id)}><Trash2 /></Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function GridCards({ products, updateQty, remove }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <Card key={p.id} className="hover:shadow-md">
          <CardContent className="flex gap-4 items-center">
            <img src={p.img} alt={p.name} className="w-24 h-24 object-cover rounded-md" />
            <div className="flex-1">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-muted-foreground">{p.shop}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="text-lg font-semibold">{formatVND(p.price)}</div>
                <div className="ml-auto flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateQty(p.id, -1)}><Minus /></Button>
                  <div className="px-3">{p.qty}</div>
                  <Button size="sm" variant="outline" onClick={() => updateQty(p.id, +1)}><Plus /></Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="ghost" onClick={() => remove(p.id)}><Trash2 /></Button>
            <Button onClick={() => alert(`Mua ${p.name}`)}>Mua ngay</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function DrawerStyle({ products, updateQty, remove, total }) {
  return (
    <div className="md:hidden">
      <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Giỏ hàng</h3>
          <Button variant="ghost" onClick={() => alert('Đóng drawer')}>Đóng</Button>
        </div>

        <div className="space-y-3 overflow-auto" style={{ maxHeight: '60vh' }}>
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-2 border rounded">
              <img src={p.img} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.shop}</div>
                <div className="mt-2 flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateQty(p.id, -1)}><Minus /></Button>
                  <div className="px-2">{p.qty}</div>
                  <Button size="sm" variant="outline" onClick={() => updateQty(p.id, +1)}><Plus /></Button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatVND(p.price)}</div>
                <Button variant="ghost" size="sm" onClick={() => remove(p.id)}><Trash2 /></Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div>Tổng</div>
            <div className="font-semibold">{formatVND(total)}</div>
          </div>
          <Button className="w-full">Thanh toán</Button>
        </div>
      </motion.div>
    </div>
  );
}
