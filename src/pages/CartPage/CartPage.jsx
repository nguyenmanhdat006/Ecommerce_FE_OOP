import React from 'react';
import { CrudPageLayout } from '@/layout/CrudPageLayout/CrudPageLayout';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUserCarts } from '@/store/features/cart';
import { selectCartItems, removeFromCart } from '@/store/features/cart';
import { Button } from '@/components/ui/button';

export default function CartPage(){
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cartState?.cart || []);

  useEffect(()=>{
    dispatch(fetchUserCarts());
  },[])

  const total = items.reduce((s, it) => s + (it.subTotal ?? (it.price * (it.quantity || 1))), 0);

  return (
    <CrudPageLayout title="Cart" actionText="Checkout" onAdd={() => console.log('checkout')}>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-muted-foreground">Cart is empty</div>
        ) : (
          <div className="space-y-2">
            {items.map((it) => (
              <div key={it.id || it.variant?.id} className="flex items-center gap-4 p-4 border rounded">
                <img src={it.thumbnail || '/src/assets/img/thumb.jpg'} alt={it.name || it.title} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{it.name || it.title}</div>
                  <div className="text-sm text-muted-foreground">Qty: {it.quantity || 1}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${(it.subTotal ?? (it.price * (it.quantity || 1))).toLocaleString()}</div>
                  <Button variant="ghost" size="sm" onClick={() => dispatch(removeFromCart({ productId: it.id, variantId: it.variant?.id }))}>Remove</Button>
                </div>
              </div>
            ))}

            <div className="text-right font-semibold">Total: ${total.toLocaleString()}</div>
          </div>
        )}
      </div>
    </CrudPageLayout>
  )
}
