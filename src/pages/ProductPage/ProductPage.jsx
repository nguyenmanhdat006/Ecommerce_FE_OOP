"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { Search, Settings, Download, Plus, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ======= ProductPage (full) ======= */

function Button({ children, className = "", variant = "default", ...props }) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return <input className={`border border-gray-300 rounded-md px-3 py-2 w-full text-sm ${className}`} {...props} />;
}

/* ProductTable: list with dropdown */
function ProductTable({ products, onOpenDetail, onNavigateAdd, navigate }) {
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">ID</th>
            <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Ảnh</th>
            <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Tên</th>
            <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Thương hiệu</th>
            <th className="text-right px-4 py-2 text-sm font-semibold text-gray-700">Giá</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700">QR</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                Không có sản phẩm
              </td>
            </tr>
          )}

          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-600">{product.id}</td>
              <td className="px-4 py-2">
                {product.thumbnail ? (
                  <img src={product.thumbnail || undefined} alt={product.name} className="w-14 h-14 rounded-md object-cover border" />
                ) : (
                  <div className="w-14 h-14 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500">No image</div>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">{product.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{product.brand || "—"}</td>
              <td className="px-4 py-2 text-sm text-gray-700 text-right font-medium">{product.price?.toLocaleString("vi-VN")} VNĐ</td>
              <td className="px-4 py-2">{origin && <QRCodeCanvas value={`${origin}/qr?id=${product.id}`} size={60} />}</td>
              <td className="px-4 py-2 relative">
                <div className="inline-block text-left">
                  <button
                    className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100"
                    onClick={() => setSelectedDropdown(selectedDropdown === product.id ? null : product.id)}
                    aria-expanded={selectedDropdown === product.id}
                  >
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>

                  {selectedDropdown === product.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                      {/* close dropdown before opening modal to avoid stuck state */}
                      <button
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          setSelectedDropdown(null);
                          // set productId then open modal in next animation frame
                          requestAnimationFrame(() => onOpenDetail(product.id));
                        }}
                      >
                        Chi tiết
                      </button>

                      <button
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          setSelectedDropdown(null);
                          navigate(`/admin/product/edit/${product.id}`);
                        }}
                      >
                        Sửa
                      </button>



                      <button
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center gap-2"
                        onClick={async () => {
                          setSelectedDropdown(null);
                          const confirmed = window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`);
                            if (!confirmed) return;

                            try {
                              const token = localStorage.getItem("token");
                            if (!token) {
                              alert("⚠️ Thiếu token, vui lòng đăng nhập lại.");
                            return;
                            }

                          const response = await axios.delete(`http://localhost:8080/api/products/${product.id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });

                            if (response.status === 200 || response.status === 204) {
                              alert("✅ Xóa sản phẩm thành công!");
                              // Cập nhật lại danh sách sản phẩm (không cần reload trang)
                              setProducts((prev) => prev.filter((p) => p.id !== product.id));
                            } else {
                              alert(`⚠️ Xóa thất bại — Status: ${response.status}`);
                            }
                            } catch (error) {
                              console.error("❌ Lỗi khi xóa:", error);
                              alert(
                                `Xóa sản phẩm thất bại.\n${error.response?.data?.message || error.message}`
                              );
                              }
                        }}

                      >
                      <Trash2 className="h-4 w-4" /> Xóa
                      </button>

                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ProductDetailModal: overlay that can be closed via backdrop, Esc, or close button */
function ProductDetailModal({ productId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [resources, setResources] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // close on Esc
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !productId) return;

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    setLoading(true);
    setProduct(null);
    setVariants([]);
    setResources([]);
    setStatuses([]);

    console.log("ℹ️ Fetching product details for:", productId);

    Promise.all([
      axios.get(`http://localhost:8080/api/products/${productId}`, { headers }).catch((e) => ({ error: e })),
      axios.get(`http://localhost:8080/api/product-variants/productId=${productId}`, { headers }).catch((e) => ({ error: e })),
      axios.get(`http://localhost:8080/api/products/${productId}/resources`, { headers }).catch((e) => ({ error: e })),
      axios.get(`http://localhost:8080/api/product-statuses?productId=${productId}`, { headers }).catch((e) => ({ error: e })),
    ])
      .then(([resP, resV, resR, resS]) => {
        console.log("resP", resP);
        console.log("resV", resV);
        console.log("resR", resR);
        console.log("resS", resS);

        if (resP?.error) {
          setProduct({ __loadError: true, message: resP.error?.response?.data?.message || resP.error.message });
        } else setProduct(resP.data);

        if (resV?.error) {
          setVariants([]);
        } else setVariants(resV.data || []);

        if (resR?.error) {
          setResources([]);
        } else setResources(resR.data || []);

        if (resS?.error) {
          setStatuses([]);
        } else setStatuses(resS.data || []);
      })
      .finally(() => setLoading(false));
  }, [open, productId]);

  if (!open) return null;

  // backdrop click closes modal; stopPropagation for inner content
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-4/5 max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">Chi tiết sản phẩm</h2>
          <button
            className="text-gray-500"
            onClick={() => onClose()}
            aria-label="Đóng"
          >
            Đóng ✕
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center">Đang tải...</div>
        ) : product && product.__loadError ? (
          <div className="py-10 text-center text-red-500">Lỗi tải sản phẩm: {product.message}</div>
        ) : !product ? (
          <div className="py-10 text-center text-gray-500">Không tìm thấy sản phẩm</div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Section 1 */}
            <section className="flex gap-6">
              <div className="w-48 h-48 rounded-lg overflow-hidden border flex-shrink-0">
                {resources.find((r) => r.isPrimary && r.url) ? (
                  <img src={resources.find((r) => r.isPrimary && r.url).url || undefined} alt={product.name} className="w-full h-full object-cover" />
                ) : product.thumbnail ? (
                  <img src={product.thumbnail || undefined} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {product.id}</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="text-2xl font-bold">{product.price?.toLocaleString("vi-VN")} VNĐ</div>
                  {product.newArrival && <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Mới</div>}
                </div>
                <p className="mt-3 text-gray-700">{product.description}</p>
                <p className="mt-2 text-sm text-gray-600">Thương hiệu: {product.brand || "—"}</p>
                <p className="mt-1 text-sm text-gray-600">Category: {product.categoryName || "—"}</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h4 className="text-lg font-semibold mb-2">Biến thể</h4>
              <div className="overflow-x-auto border rounded">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm text-gray-600">Màu</th>
                      <th className="px-4 py-2 text-left text-sm text-gray-600">Size</th>
                      <th className="px-4 py-2 text-right text-sm text-gray-600">Tồn kho</th>
                      <th className="px-4 py-2 text-left text-sm text-gray-600">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.length ? variants.map((v) => {
                      const qty = Number(v.stockQuantity) || 0;
                      const status = qty === 0 ? "Hết hàng" : qty < 5 ? "Tồn kho thấp" : "Còn hàng";
                      const colorClass = qty === 0 ? "text-red-600" : qty < 5 ? "text-amber-600" : "text-green-600";
                      return (
                        <tr key={v.id} className="border-t">
                          <td className="px-4 py-2 text-sm text-gray-700">{v.color || "—"}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{v.size || "—"}</td>
                          <td className="px-4 py-2 text-sm text-right">{qty}</td>
                          <td className={`px-4 py-2 text-sm ${colorClass}`}>{status}</td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Không có biến thể</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h4 className="text-lg font-semibold mb-2">Hình ảnh</h4>
              <div className="grid grid-cols-4 gap-3">
                {resources.length ? resources.map((r) => (
                  <div key={r.id} className={`border rounded overflow-hidden ${r.isPrimary ? "ring-2 ring-yellow-300" : ""}`}>
                    {r.url ? <img src={r.url || undefined} alt={r.name} className="w-full h-28 object-cover" /> : <div className="w-full h-28 flex items-center justify-center text-sm text-gray-400">No image</div>}
                  </div>
                )) : <div className="text-sm text-gray-400">Không có tài nguyên</div>}
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h4 className="text-lg font-semibold mb-2">Lịch sử trạng thái</h4>
              <div className="space-y-2">
                {statuses.length ? statuses.map((s) => (
                  <div key={s.id} className="text-sm text-gray-700 border rounded p-2">
                    <div className="text-xs text-gray-500">{new Date(s.createdAt || s.timestamp || s.date || 0).toLocaleString()}</div>
                    <div className="mt-1">{s.status || s.note || "—"}</div>
                  </div>
                )) : <div className="text-sm text-gray-400">Không có lịch sử trạng thái</div>}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

/* Main Page component */
export default function ProductPageMain() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const navigate = useNavigate();

  // initial load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/products", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setProducts(res.data || []);
      } catch (err) {
        console.error("Lỗi khi tải products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // stats
  const totalProducts = products.length;
  const inStock = products.filter((p) => p.variants?.some((v) => Number(v.stockQuantity) > 0)).length;
  const outOfStock = products.filter((p) => p.variants?.every((v) => Number(v.stockQuantity) === 0)).length;
  const lowStock = products.filter((p) => p.variants?.some((v) => Number(v.stockQuantity) > 0 && Number(v.stockQuantity) < 5)).length;

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 overflow-auto">
        <header className="border-b bg-white p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2" onClick={() => navigate("/admin/product/add")}>
              <Plus className="h-4 w-4" /> Thêm sản phẩm
            </Button>
            <Button variant="outline"><Download className="h-4 w-4" /></Button>
            <Button variant="outline"><Settings className="h-4 w-4" /></Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <section>
            <h1 className="text-2xl font-bold mb-4">Tổng quan sản phẩm</h1>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white shadow">
                <div className="text-sm text-gray-500">Tổng sản phẩm</div>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </div>
              <div className="p-4 rounded-lg bg-white shadow">
                <div className="text-sm text-gray-500">Còn hàng </div>
                <div className="text-2xl font-bold">{inStock}</div>
              </div>
              <div className="p-4 rounded-lg bg-white shadow">
                <div className="text-sm text-gray-500">Tồn kho thấp</div>
                <div className="text-2xl font-bold">{lowStock}</div>
              </div>
              <div className="p-4 rounded-lg bg-white shadow">
                <div className="text-sm text-gray-500">Hết hàng</div>
                <div className="text-2xl font-bold">{outOfStock}</div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>
            </div>

            <ProductTable
              products={products.filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.id?.toLowerCase().includes(searchTerm.toLowerCase()))}
              onOpenDetail={(id) => {
                // ensure previous dropdown closed and then open modal
                setSelectedProductId(id);
                setDetailOpen(true);
              }}
              onNavigateAdd={() => navigate("/admin/product/add")}
              navigate={navigate}
            />
          </section>
        </div>
      </main>

      <ProductDetailModal
        productId={selectedProductId}
        open={detailOpen}
        onClose={() => {
          // fully reset modal & selected id to avoid stale state/dangling dropdown
          setDetailOpen(false);
          setSelectedProductId(null);
        }}
      />
    </div>
  );
}
