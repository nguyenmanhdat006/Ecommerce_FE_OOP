import { useState, useEffect } from "react";
import { orderAPI } from '@/api/order.api';
import { MapPin, Store, MessageCircle, Ticket, Truck, Coins, Check } from "lucide-react";
import { getUser } from '@/utils/jwt-helper';
import { useNavigate } from "react-router-dom";

export default function Checkout() {

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [cartItems, setCartItems] = useState([]);
  const [shippingFee] = useState(10000);
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState();
  const [selectedBank, setSelectedBank] = useState(null);

  const vouchers = [
    { id: 1, code: "GIAM10K", discount: 10000, minOrder: 50000 },
    { id: 2, code: "GIAM20K", discount: 20000, minOrder: 100000 },
    { id: 3, code: "GIAM50K", discount: 50000, minOrder: 300000 },
  ];

  const user = getUser();
  console.log('checkout user:', user);
  if (!user) {
        alert("Bạn cần đăng nhập để đặt hàng");
        return;
      }

  // Lấy sản phẩm từ localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    setCartItems(stored);
  }, []);

  const bankPromotions = [
    { id: 1, bank: "SHINHAN", discount: 50000, minOrder: 500000, logo: "🏦" },
    { id: 2, bank: "BVBank", discount: 50000, minOrder: 550000, logo: "🏦" },
    { id: 3, bank: "PGBank", discount: "30%", minOrder: 30000, maxDiscount: "Mỗi ngày", logo: "🏦" },
    { id: 4, bank: "Shinhan Finance", discount: 50000, minOrder: 400000, type: "Mastercard", logo: "💳" },
    { id: 5, bank: "ACB", discount: 50000, minOrder: 500000, type: "ACB", logo: "🏦" },
    { id: 6, bank: "NCB", discount: 50000, minOrder: 500000, logo: "🏦" },
    { id: 7, bank: "Sacombank", discount: 50000, expired: true, logo: "🏦" },
    { id: 8, bank: "OCB", discount: 200000, expired: true, logo: "🏦" },
    { id: 9, bank: "KBank", discount: 50000, expired: true, logo: "🏦" },
    { id: 10, bank: "VPBank", discount: 50000, expired: true, logo: "🏦" },
    { id: 11, bank: "LPBank", discount: 80000, expired: true, logo: "🏦" },
    { id: 12, bank: "FE CREDIT", discount: 55000, expired: true, logo: "💳" },
    { id: 13, bank: "MB", discount: 50000, expired: true, logo: "🏦" },
    { id: 14, bank: "HDBank", discount: 50000, expired: true, logo: "🏦" },
    { id: 15, bank: "VIB", discount: 100000, expired: true, logo: "🏦" },
  ];

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = selectedVoucher && totalPrice >= selectedVoucher.minOrder ? selectedVoucher.discount : 0;
  const totalPayment = totalPrice + shippingFee - discount;
  const [isPlacing, setIsPlacing] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-md shadow-sm p-6 text-gray-800 mb-10">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>Địa Chỉ Nhận Hàng</span>
        </h2>
        <div className="mt-2 text-sm flex justify-between items-start">
          <div>
            <p className="font-medium">Nguyễn Mạnh Đạt <span className="ml-2 text-gray-600">(+84) 345 455 326</span></p>
            <p className="text-gray-600 mt-1">Ngõ 3 Cúc Phố, Xã Vinh Quang, Huyện Vĩnh Bảo, Hải Phòng</p>
          </div>
          <button className="text-blue-600 hover:underline">Thay đổi</button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-gray-600" />
          <span className="font-semibold">Shopease</span>
        </div>
        <button className="flex items-center text-teal-600 hover:underline text-sm">
          <MessageCircle className="w-4 h-4 mr-1" />Chat ngay
        </button>
      </div>

      {cartItems.length > 0 ? (
        cartItems.map((item, i) => (
          <div key={i} className="grid grid-cols-[80px_1fr_100px_60px_100px] items-center gap-4 py-4 border-b border-gray-200">
            <img src={item.img} alt={item.name} className="w-20 h-20 object-cover border rounded-md" />
            <div>
              <p className="text-sm">{item.name}</p>
              <p className="text-xs text-gray-500 mt-1">Phân loại: {item.color || "-"}, {item.size || "-"}</p>
            </div>
            <div className="text-sm">{item.price.toLocaleString()}₫</div>
            <div className="text-center text-sm">{item.qty}</div>
            <div className="text-sm font-medium">{(item.price * item.qty).toLocaleString()}₫</div>
          </div>
        ))
      ) : (
        <p className="py-6 text-center text-gray-500 text-sm">Giỏ hàng của bạn đang trống.</p>
      )}

      <div className="py-4 border-b border-gray-200 relative">
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-red-500" />
            <span>Voucher của Shop</span>
          </div>
          <div className="relative">
            <button className="text-blue-600 hover:underline font-medium" onClick={() => setShowVoucherList(!showVoucherList)}>
              {selectedVoucher ? selectedVoucher.code : "Chọn Voucher"}
            </button>
            {showVoucherList && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-20">
                {vouchers.map((v) => {
                  const isEligible = totalPrice >= v.minOrder;
                  return (
                    <div key={v.id} className={`p-3 cursor-pointer flex justify-between items-center hover:bg-gray-50 ${!isEligible && "opacity-50"}`}
                      onClick={() => isEligible && (setSelectedVoucher(v), setShowVoucherList(false))}>
                      <div>
                        <p className="font-semibold text-sm">{v.code}</p>
                        <p className="text-xs text-gray-500">Giảm {v.discount.toLocaleString()}₫ - đơn từ {v.minOrder.toLocaleString()}₫</p>
                      </div>
                      {selectedVoucher?.id === v.id && <Check className="text-green-600 w-5 h-5" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-start text-sm">
          <div>
            <p><span className="font-semibold">Phương thức vận chuyển:</span> Nhanh</p>
            <p className="text-teal-600 mt-1 flex items-center"><Truck className="w-4 h-4 mr-1" />Nhận từ 5 Th11 - 6 Th11</p>
            <p className="text-gray-500 text-xs mt-1">Nhận Voucher 15.000₫ nếu giao trễ</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-blue-600 hover:underline">Thay đổi</button>
            <span className="font-medium">{shippingFee.toLocaleString()}₫</span>
          </div>
        </div>

        <div className="text-right mt-4 font-semibold text-sm">
          Tổng số tiền ({cartItems.length} sản phẩm):
          <span className="text-orange-600 text-base ml-1">{totalPayment.toLocaleString()}₫</span>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-t border-gray-100 text-sm">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span>Shopease Xu</span>
        </div>
        <span className="text-gray-400">Không thể sử dụng Xu</span>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold mb-3 text-base">Phương thức thanh toán</h3>
        
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[ "creditCard", "googlePay", "napas", "vnpay", "cod"].map((method) => (
            <button key={method} className={`px-4 py-2 text-sm whitespace-nowrap rounded border transition-all ${paymentMethod === method ? "border-orange-500 text-orange-500 bg-orange-50" : "border-gray-300 text-gray-700"}`}
              onClick={() => setPaymentMethod(method)}>
              {/* {method === "shopeePay" && "Ví ShopeePay"} */}
              {method === "creditCard" && "Thẻ Tín dụng/Ghi nợ"}
              {method === "googlePay" && "Google Pay"}
              {method === "napas" && "Thẻ nội địa NAPAS"}
              {method === "vnpay" && "VNPAY"}
              {method === "cod" && "Thanh toán khi nhận hàng"}
            </button>
          ))}
        </div>

        <div className="min-h-[200px]">
          {/* {paymentMethod === "shopeePay" && (
            <div>
              <img src="https://placehold.co/300x100/ee4d2d/white?text=ShopeePay" alt="Banner" className="w-full max-w-xs rounded mb-4" />
              <div className="flex items-center gap-3 p-3 border rounded">
                <input type="radio" checked readOnly className="w-4 h-4" />
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">đ</div>
                <div>
                  <p className="font-medium">Số dư Ví ShopeePay</p>
                  <p className="text-sm text-gray-600">0₫</p>
                </div>
              </div>
            </div>
          )} */}

          {(paymentMethod === "creditCard" || paymentMethod === "napas") && (
            <div>
              <p className="text-sm font-semibold mb-3">Promotion</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {(paymentMethod === "napas" ? bankPromotions.slice(0, 6) : bankPromotions).map((promo) => (
                  <div key={promo.id} className={`p-3 border rounded cursor-pointer transition-all ${promo.expired ? "bg-gray-200 opacity-60" : selectedBank === promo.id ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
                    onClick={() => !promo.expired && setSelectedBank(promo.id)}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl">{promo.logo}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{promo.bank}</span>
                    </div>
                    <p className="font-bold text-lg mb-1">{typeof promo.discount === "number" ? `₫${promo.discount.toLocaleString()} Giảm` : promo.discount}</p>
                    <p className="text-xs text-gray-600">
                      {promo.expired ? "Ưu đãi này đã hết lượt sử dụng" : promo.type ? `Đơn từ ₫${promo.minOrder.toLocaleString()} - Mỗi ngày với thẻ ${promo.type}` : promo.maxDiscount ? `Tối đa ₫${promo.minOrder.toLocaleString()} - ${promo.maxDiscount}` : `Đơn từ ₫${promo.minOrder.toLocaleString()} mỗi Chủ Nhật`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {paymentMethod === "googlePay" && <div className="flex items-center justify-center h-40 text-gray-400">Google Pay chưa được kích hoạt</div>}

          {paymentMethod === "vnpay" && (
            <div className="bg-white p-4 ">
              <p className="font-medium mb-2">Thanh toán qua cổng VNPAY</p>
              <p className="text-sm text-gray-600 mb-3">Bạn sẽ được chuyển đến cổng thanh toán VNPAY để hoàn tất giao dịch.</p>
            </div>
          )}

          {paymentMethod === "cod" && (
            <div className="bg-gray-50 p-4 rounded border">
              <p className="font-medium mb-2">Thanh toán khi nhận hàng</p>
              <p className="text-sm text-gray-600 mb-3">Phí thu hộ: ₫0 VND. Ưu đãi về phí vận chuyển (nếu có) áp dụng cả với phí thu hộ.</p>
              <div className="bg-white p-3 rounded border text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tổng tiền hàng</span>
                  <span>{totalPrice.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tổng tiền phí vận chuyển</span>
                  <span>{shippingFee.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Tổng thanh toán</span>
                  <span className="text-orange-600">{totalPayment.toLocaleString()}₫</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center text-sm mb-2">
          <span>Tổng tiền hàng</span>
          <span>{totalPrice.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between items-center text-sm mb-2">
          <span>Phí vận chuyển</span>
          <span>{shippingFee.toLocaleString()}₫</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-sm mb-2 text-green-600">
            <span>Giảm giá Voucher</span>
            <span>-{discount.toLocaleString()}₫</span>
          </div>
        )}
        <div className="flex justify-between items-center text-lg font-semibold text-orange-600 mt-2">
          <span>Tổng thanh toán</span>
          <span>{totalPayment.toLocaleString()}₫</span>
        </div>
        <div className="text-right mt-5">
        <button
          className={`bg-orange-600 text-white px-10 py-2 rounded-sm font-medium hover:bg-orange-700 transition-all ${isPlacing ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={async () => {
            if (cartItems.length === 0) return alert('Giỏ hàng rỗng');

            setIsPlacing(true);
            try {
              // Tạo payload order
              const orderItems = cartItems.map(it => ({
                productId: it.productId,
                productVariantId: it.productVariantId || it.variantId || null,
                quantity: it.qty || it.quantity || 1,
                unitPrice: Number(it.price || 0),
                totalPrice: Number((it.price || 0) * (it.qty || it.quantity || 1)),
              }));

              const payload = {
                orderNumber: new Date().toISOString(),
                totalAmount: totalPayment,
                // status: paymentMethod === "cod" ? "PENDING" : "UNPAID",
                status: "PENDING",
                paymentStatus: paymentMethod === "vnpay" ? "PAID" : "UNPAID",
                paymentMethod,
                shippingAddress: 'Thanh Lương, Hải Phòng',
                notes: '',
                customerId: user.id,
                orderItems,
              };

              const orderResponse = await orderAPI.create(payload);
              const orderId = orderResponse?.id;
              if (!orderId) throw new Error('Không lấy được ID đơn hàng từ server');

              // Xử lý thanh toán
              switch (paymentMethod) {
                case "vnpay":
                  {
                    const res = await fetch("http://localhost:8080/api/vnpay/create-payment", {
                      method: "POST",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ orderId, amount: totalPayment }),
                    });
                    const paymentUrl = await res.text();
                    window.location.href = paymentUrl; // Redirect sang VNPAY
                  }
                  break;

                // case "shopeePay":
                case "creditCard":
                case "googlePay":
                case "napas":
                  {
                    // Giả lập redirect đến cổng tương ứng
                    const res = await fetch(`http://localhost:8080/api/payment/${paymentMethod}`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ orderId, amount: totalPayment, bankId: selectedBank || null }),
                    });
                    const { paymentUrl } = await res.json();
                    if (paymentUrl) window.location.href = paymentUrl;
                    else {
                      alert('Thanh toán thành công'); // Trường hợp thử nghiệm
                      localStorage.removeItem('checkoutItems');
                      setCartItems([]);
                    }
                  }
                  break;

                case "cod":
                  {
                    alert('Đặt hàng thành công! Vui lòng chuẩn bị tiền khi nhận hàng.');
                    navigate(`/order-success/`);
                    localStorage.removeItem('checkoutItems');
                    setCartItems([]);
                  }
                  break;

                default:
                  alert('Phương thức thanh toán chưa được hỗ trợ');
                  break;
              }

            } catch (err) {
              console.error('Checkout failed', err);
              alert(err?.message || 'Đặt hàng thất bại');
            } finally {
              setIsPlacing(false);
            }
          }}
          disabled={isPlacing}
        >
          {isPlacing ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>

        </div>
      </div>
    </div>
  );
}