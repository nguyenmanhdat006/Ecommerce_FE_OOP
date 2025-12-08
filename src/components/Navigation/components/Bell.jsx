import React, { useEffect, useState, useRef } from 'react';
import { Bell as BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { orderAPI } from '@/api/order.api';
import { formatCurrency } from '@/utils/currencyFormatter';
import { useNavigate } from 'react-router-dom';

export default function BellComponent() {
  const navigate = useNavigate();
  const [unreviewedItems, setUnreviewedItems] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load unreviewed items
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await orderAPI.getUnreviewed();
        if (!mounted) return;
        setUnreviewedItems(Array.isArray(res) ? res : res?.data || []);
      } catch (err) {
        console.error('Failed to load unreviewed items', err);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  // Click outside closes dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-11 w-11"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Unreviewed orders"
      >
        <BellIcon size={20} />
        {unreviewedItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white rounded-full text-[11px] w-5 h-5 flex items-center justify-center">
            {unreviewedItems.length}
          </span>
        )}
      </Button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50 overflow-hidden"
          style={{ minWidth: 300 }}
        >
          <div className="p-3 border-b font-medium bg-gray-600 text-white">Vui lòng đánh giá sản phẩm</div>

          <div className="max-h-64 overflow-auto">
            {unreviewedItems.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">
                Không có đơn hàng cần đánh giá.
              </div>
            ) : (
              unreviewedItems.map((it) => (
                <div
                  key={it.id}
                  className="p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors bg-white border-b last:border-0"
                  style={{ borderRadius: 8, margin: '6px 8px' }}
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {it.productName || it.name || 'Sản phẩm'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Số lượng: {it.quantity} •{' '}
                      {it.unitPrice ? formatCurrency(it.unitPrice) : ''}
                    </div>
                  </div>

                  <button
                    className="text-sm text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);

                      // ensure dropdown closes before navigation
                      setTimeout(() => {
                        navigate('/order-success');
                      }, 0);
                    }}
                  >
                    Đánh giá
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t text-right bg-gray-50">
            <button
              className="text-xs text-gray-600 rounded px-2 py-1 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
