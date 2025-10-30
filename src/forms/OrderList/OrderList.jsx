import React from "react";
import { Download, Plus, MoreVertical } from "lucide-react";

const orders = [
  { id: "ORD001", customer: "Nguyễn Văn A", total: "2.500.000 VNĐ", status: "Hoàn thành", date: "2024-07-20" },
  { id: "ORD002", customer: "Trần Thị B", total: "1.200.000 VNĐ", status: "Chờ xử lý", date: "2024-07-19" },
  { id: "ORD003", customer: "Lê Văn C", total: "500.000 VNĐ", status: "Đã hủy", date: "2024-07-18" },
  { id: "ORD004", customer: "Phạm Thị D", total: "3.000.000 VNĐ", status: "Hoàn thành", date: "2024-07-17" },
  { id: "ORD005", customer: "Hoàng Văn E", total: "800.000 VNĐ", status: "Chờ xử lý", date: "2024-07-16" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Hoàn thành":
      return "bg-green-100 text-green-700";
    case "Chờ xử lý":
      return "bg-blue-100 text-blue-700";
    case "Đã hủy":
      return "bg-red-100 text-red-700";
    default:
      return "";
  }
};

export function OrderList() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Danh sách đơn hàng</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-100 transition">
            <Download size={18} /> Xuất
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            <Plus size={18} /> Thêm đơn hàng
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Tổng số đơn hàng</p>
          <h2 className="text-2xl font-semibold mt-1">1.250</h2>
          <p className="text-green-600 text-sm">+20% so với tháng trước</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Tổng doanh thu</p>
          <h2 className="text-2xl font-semibold mt-1">50.000.000 VNĐ</h2>
          <p className="text-green-600 text-sm">+15% so với tháng trước</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Đơn hàng chờ xử lý</p>
          <h2 className="text-2xl font-semibold mt-1">150</h2>
          <p className="text-gray-500 text-sm">5 đơn hàng mới hôm nay</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Đơn hàng đã hoàn thành</p>
          <h2 className="text-2xl font-semibold mt-1">1.100</h2>
          <p className="text-green-600 text-sm">+10% so với tháng trước</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap gap-3">
          <input type="text" placeholder="Tìm kiếm theo mã đơn hàng" className="border rounded-lg px-3 py-2 w-56" />
          <input type="text" placeholder="Tìm kiếm theo tên khách hàng" className="border rounded-lg px-3 py-2 w-56" />
          <select className="border rounded-lg px-3 py-2 w-48">
            <option>Tất cả trạng thái</option>
            <option>Hoàn thành</option>
            <option>Chờ xử lý</option>
            <option>Đã hủy</option>
          </select>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">Đặt lại</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Áp dụng bộ lọc</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-3">Mã đơn hàng</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Tổng số tiền</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ngày đặt hàng</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.customer}</td>
                <td className="p-3">{o.total}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(o.status)}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-3">{o.date}</td>
                <td className="p-3 text-gray-500">
                  <MoreVertical size={18} className="cursor-pointer hover:text-gray-800" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 p-4">
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">Previous</button>
          <span className="px-3 py-1 border rounded-lg bg-indigo-600 text-white">1</span>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">2</button>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">3</button>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );
}
