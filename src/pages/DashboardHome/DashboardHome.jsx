import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, DollarSign, ShoppingCart, TrendingUp, Bell, Users } from 'lucide-react';
import WebSocketManager from "@/lib/websocketManager";
import { dashboardAPI } from '@/api/dashboard.api';

const DashboardHome = () => {
  // State cho KPI Cards
  const [kpi, setKpi] = useState({
    processingOrders: 0,
    todayRevenue: 0,
    timestamp: null
  });

  // State cho Charts
  const [hourlyRevenue, setHourlyRevenue] = useState([]);
  const [orderStatusDist, setOrderStatusDist] = useState([]);

  // State cho WebSocket
  const [wsStatus, setWsStatus] = useState('Đang kết nối...');
  const [notifications, setNotifications] = useState([]);
  const wsRef = useRef(null);

  // Animation state cho KPI cards
  const [animatingKpi, setAnimatingKpi] = useState({});

  // Format số tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Fetch initial data từ REST API
  const fetchInitialData = async () => {
    try {
      const res = await dashboardAPI.getKpi();
      // axiosClient response interceptor returns response.data, so res is the data
      setKpi(res);
    } catch (error) {
      console.error('Failed to fetch initial KPI:', error);
    }
  };
  
  // Handle KPI Update với animation
  const handleKpiUpdate = useCallback((payload) => {
    setKpi(prev => {
      // Trigger animation nếu giá trị thay đổi
      if (prev.processingOrders !== payload.processingOrders) {
        setAnimatingKpi(a => ({ ...a, processingOrders: true }));
        setTimeout(() => setAnimatingKpi(a => ({ ...a, processingOrders: false })), 600);
      }
      if (prev.todayRevenue !== payload.todayRevenue) {
        setAnimatingKpi(a => ({ ...a, todayRevenue: true }));
        setTimeout(() => setAnimatingKpi(a => ({ ...a, todayRevenue: false })), 600);
      }
      return { ...prev, ...payload };
    });
  }, []);

  // Handle New Order với notification
  const handleNewOrder = useCallback((payload) => {
    const notification = {
      id: Date.now(),
      type: 'success',
      title: '🛒 Đơn hàng mới!',
      message: `${payload.customerName} - ${formatCurrency(payload.total)}`,
      time: new Date().toLocaleTimeString('vi-VN')
    };
    setNotifications(prev => [notification, ...prev].slice(0, 5));
  }, []);

  // Handle Order Status Changed
  const handleOrderStatusChanged = useCallback(async (payload) => {
    const statusMap = {
      PENDING: 'Chờ xác nhận',
      SHIPPING: 'Đang vận chuyển',
      WAIT_DELIVER: 'Chờ giao hàng',
      PAID: 'Hoàn thành',
      CANCELED: 'Đã hủy',
      REFUND: 'Hoàn tiền'
    };
    
    const notification = {
      id: Date.now(),
      type: 'info',
      title: '📦 Cập nhật trạng thái',
      message: `${statusMap[payload.oldStatus]} → ${statusMap[payload.newStatus]}`,
      time: new Date().toLocaleTimeString('vi-VN')
    };
    setNotifications(prev => [notification, ...prev].slice(0, 5));
    if (payload.newStatus === 'PAID') {
      try {
        await dashboardAPI.refresh();
      } catch (error) {
        console.error('Failed to refresh dashboard charts:', error);
      }
    }

  }, []);

  // Handle Revenue Update
  const handleRevenueUpdate = useCallback((payload) => {
    setKpi(prev => ({ ...prev, todayRevenue: payload.todayRevenue }));
    setAnimatingKpi(a => ({ ...a, todayRevenue: true }));
    setTimeout(() => setAnimatingKpi(a => ({ ...a, todayRevenue: false })), 600);
  }, []);

  // Handle WebSocket message
  const handleWebSocketMessage = useCallback((event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('📡 Received:', message);

      switch (message.type) {
        case 'CONNECTION_SUCCESS':
          console.log('🎉', message.payload);
          break;

        case 'KPI_UPDATE':
          handleKpiUpdate(message.payload);
          break;

        case 'NEW_ORDER':
          handleNewOrder(message.payload);
          break;

        case 'ORDER_STATUS_CHANGED':
          handleOrderStatusChanged(message.payload);
          break;

        case 'REVENUE_UPDATED':
          handleRevenueUpdate(message.payload);
          break;

        case 'HOURLY_REVENUE':
          setHourlyRevenue(message.payload);
          break;

        case 'ORDER_STATUS_DISTRIBUTION':
          const distArray = Object.entries(message.payload).map(([status, count]) => ({
            status,
            count
          }));
          setOrderStatusDist(distArray);
          break;

        default:
          console.log('Unknown event type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [handleKpiUpdate, handleNewOrder, handleOrderStatusChanged, handleRevenueUpdate]);

  // Setup WebSocket với WebSocketManager
  useEffect(() => {
    // Fetch initial data
    fetchInitialData();

    // Create WebSocket connection với auto-reconnect
  const ws = new WebSocketManager(dashboardAPI.wsUrl(), {
      autoReconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: Infinity
    });

    // Event handlers
    ws.on('open', () => {
      console.log('✅ Connected to Dashboard WebSocket');
      setWsStatus('Đã kết nối');
    });

    ws.on('message', handleWebSocketMessage);

    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
      setWsStatus('Lỗi kết nối');
    });

    ws.on('close', () => {
      console.log('❌ WebSocket closed');
      setWsStatus('Mất kết nối');
    });

    // Connect
    ws.connect();

    // Store ref
    wsRef.current = ws;

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [handleWebSocketMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Theo dõi đơn hàng và doanh thu thời gian thực</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className={`w-2 h-2 rounded-full ${wsStatus === 'Đã kết nối' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-slate-700">{wsStatus}</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Đơn đang xử lý */}
          <Card className={`transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${animatingKpi.processingOrders ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Đơn đang xử lý
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{kpi.processingOrders}</div>
              <p className="text-xs text-slate-500 mt-1">Đơn chưa hoàn thành</p>
            </CardContent>
          </Card>

          {/* Doanh thu hôm nay */}
          <Card className={`transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${animatingKpi.todayRevenue ? 'ring-2 ring-green-500 scale-105' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Doanh thu hôm nay
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {formatCurrency(kpi.todayRevenue)}
              </div>
              <p className="text-xs text-slate-500 mt-1">Đơn đã hoàn thành</p>
            </CardContent>
          </Card>

          {/* Hoạt động */}
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Hoạt động
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {kpi.processingOrders > 0 ? '🟢 Live' : '⚪ Idle'}
              </div>
              <p className="text-xs text-slate-500 mt-1">Trạng thái hệ thống</p>
            </CardContent>
          </Card>

          {/* Thông báo */}
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Thông báo
              </CardTitle>
              <Bell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{notifications.length}</div>
              <p className="text-xs text-slate-500 mt-1">Sự kiện mới</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hourly Revenue Chart */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Doanh thu theo giờ
              </CardTitle>
              <CardDescription>Biểu đồ doanh thu hôm nay</CardDescription>
            </CardHeader>
            <CardContent>
              {hourlyRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(hour) => `${hour}h`}
                    />
                    <YAxis 
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(hour) => `${hour}:00`}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  Chưa có dữ liệu doanh thu
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Status Distribution */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                Phân bố trạng thái đơn
              </CardTitle>
              <CardDescription>Số lượng đơn theo trạng thái</CardDescription>
            </CardHeader>
            <CardContent>
              {orderStatusDist.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderStatusDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="status" 
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#8b5cf6" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  Chưa có dữ liệu trạng thái
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Thông báo realtime
              </CardTitle>
              <CardDescription>Các sự kiện mới nhất</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notif) => (
                <Alert 
                  key={notif.id} 
                  className="animate-in slide-in-from-right duration-300"
                >
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{notif.title}</span>
                      <span className="ml-2 text-slate-600">{notif.message}</span>
                    </div>
                    <span className="text-xs text-slate-500">{notif.time}</span>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;