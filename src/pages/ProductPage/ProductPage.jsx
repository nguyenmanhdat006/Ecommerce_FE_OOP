import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from 'react-hot-toast';
import { Search, Settings, Download, Plus, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, fetchProductById } from '@/store/productSlice';
import { formatCurrency } from '@/utils/currencyFormatter';
import { useTranslation } from 'react-i18next';


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
function ProductTable({ products, onOpenDetail, navigate, onDeleteProduct }) {
  const { t } = useTranslation();
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
            <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">{t('admin.products.id')}</th>
            <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">{t('admin.products.image')}</th>
            <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">{t('admin.products.name')}</th>
            <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">{t('admin.products.brand')}</th>
            <th className="text-right px-4 py-2 text-sm font-semibold text-gray-700">{t('admin.products.price')}</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700">{t('admin.products.qr')}</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                {t('admin.products.noProducts')}
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
                  <div className="w-14 h-14 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500">{t('admin.products.noImage')}</div>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">{product.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{product.brand || "—"}</td>
              <td className="px-4 py-2 text-sm text-gray-700 text-right font-medium">{formatCurrency(product.price)}</td>
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
                        {t('admin.common.detail')}
                      </button>

                      <button
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          setSelectedDropdown(null);
                          navigate(`/admin/product/edit/${product.id}`);
                        }}
                      >
                        {t('admin.common.edit')}
                      </button>



                      <button
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center gap-2"
                        onClick={async () => {
                          setSelectedDropdown(null);
                          const confirmed = window.confirm(t('admin.products.deleteConfirm', { name: product.name }));
                          if (!confirmed) return;
                          onDeleteProduct(product.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> {t('admin.common.delete')}
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
  const dispatch = useDispatch();
  const productDetail = useSelector((state) => state.productSlice?.productDetail);
  const loading = useSelector((state) => state.productSlice?.loading);
  const error = useSelector((state) => state.productSlice?.error);

  // close on Esc
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Fetch product detail when modal opens
  useEffect(() => {
    if (!open || !productId) return;
    dispatch(fetchProductById(productId));
  }, [open, productId, dispatch]);

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
        ) : error ? (
          <div className="py-10 text-center text-red-500">Lỗi tải sản phẩm: {error}</div>
        ) : !productDetail ? (
          <div className="py-10 text-center text-gray-500">Không tìm thấy sản phẩm</div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Section 1 */}
            <section className="flex gap-6">
              <div className="w-48 h-48 rounded-lg overflow-hidden border flex-shrink-0">
                {productDetail.productResources?.find((r) => r.isPrimary && r.url) ? (
                  <img src={productDetail.productResources.find((r) => r.isPrimary && r.url).url || undefined} alt={productDetail.name} className="w-full h-full object-cover" />
                ) : productDetail.thumbnail ? (
                  <img src={productDetail.thumbnail || undefined} alt={productDetail.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold">{productDetail.name}</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {productDetail.id}</p>
                {productDetail.slug && (
                  <p className="text-sm text-gray-500">Slug: {productDetail.slug}</p>
                )}
                <div className="mt-3 flex items-center gap-4">
                  <div className="text-2xl font-bold">{formatCurrency(productDetail.price)}</div>
                  {productDetail.newArrival && <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Mới</div>}
                  {productDetail.rating && (
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      ⭐ {productDetail.rating}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-gray-700">{productDetail.description || "—"}</p>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Thương hiệu:</span> {productDetail.brand || "—"}
                  </p>
                  {productDetail.categoryName && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {productDetail.categoryName}
                    </p>
                  )}
                  {productDetail.categoryTypeName && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category Type:</span> {productDetail.categoryTypeName}
                    </p>
                  )}
                </div>
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
                    {productDetail.variants?.length ? productDetail.variants.map((v) => {
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
                {productDetail.productResources?.length ? productDetail.productResources.map((r) => (
                  <div key={r.id} className={`border rounded overflow-hidden ${r.isPrimary ? "ring-2 ring-yellow-300" : ""}`}>
                    {r.url ? <img src={r.url || undefined} alt={r.name} className="w-full h-28 object-cover" /> : <div className="w-full h-28 flex items-center justify-center text-sm text-gray-400">No image</div>}
                  </div>
                )) : <div className="text-sm text-gray-400">Không có tài nguyên</div>}
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
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const navigate = useNavigate();

  // Use Redux store directly
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productSlice?.products || []);
  const loading = useSelector((state) => state.productSlice?.loading);
  const error = useSelector((state) => state.productSlice?.error);
  const storeLoaded = useSelector((state) => state.productSlice?.loaded);

  // Fetch products on mount if not loaded
  useEffect(() => {
    if (!storeLoaded || products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, storeLoaded, products.length]);

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    try {
      const result = await dispatch(deleteProduct(productId));
      if (deleteProduct.fulfilled.match(result)) {
        toast.success(t('admin.products.deleteSuccess'));
      } else {
        const errorMessage = result.payload?.message || result.error?.message || 'Unknown error';
        toast.error(t('admin.products.deleteFailed', { error: errorMessage }));
      }
    } catch (error) {
      console.error("❌ Lỗi khi xóa:", error);
      toast.error(t('admin.products.deleteFailed', { error: error?.message || 'Unknown error' }));
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter((p) => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );



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
              <Input placeholder={t('admin.products.search')} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2" onClick={() => navigate("/admin/product/add")}>
              <Plus className="h-4 w-4" /> {t('admin.products.addProduct')}
            </Button>
            <Button variant="outline"><Download className="h-4 w-4" /></Button>
            <Button variant="outline"><Settings className="h-4 w-4" /></Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <section>
            <h1 className="text-2xl font-bold mb-4">{t('admin.products.overview')}</h1>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white shadow">
                <div className="text-sm text-gray-500">{t('admin.products.totalProducts')}</div>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </div>
              <div className="p-4 rounded-lg bg-white shadow">
                <div className="text-sm text-gray-500">{t('admin.products.inStock')}</div>
                <div className="text-2xl font-bold">{inStock}</div>
              </div>
              <div className="p-4 rounded-lg bg-white shadow">
                <div className="text-sm text-gray-500">{t('admin.products.lowStock')}</div>
                <div className="text-2xl font-bold">{lowStock}</div>
              </div>
              <div className="p-4 rounded-lg bg-white shadow">
                <div className="text-sm text-gray-500">{t('admin.products.outOfStock')}</div>
                <div className="text-2xl font-bold">{outOfStock}</div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{t('admin.products.productList')}</h2>
            </div>

            {loading && products.length === 0 && (
              <div className="text-center py-10 text-gray-500">Đang tải...</div>
            )}
            {error && products.length === 0 && (
              <div className="text-center py-10 text-red-500">Lỗi: {error}</div>
            )}
            <ProductTable
              products={filteredProducts}
              onOpenDetail={(id) => {
                // ensure previous dropdown closed and then open modal
                setSelectedProductId(id);
                setDetailOpen(true);
              }}
              onNavigateAdd={() => navigate("/admin/product/add")}
              navigate={navigate}
              onDeleteProduct={handleDeleteProduct}
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
