import React, { useEffect } from "react";
import { CrudPageLayout } from "@/layout/CrudPageLayout/CrudPageLayout";
import { DataTable } from "@/components/DataTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash, Eye } from "lucide-react";
import { deleteUser } from "@/store/adminUserSlice";
import Spinner from "@/components/Spinner/Spinner";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useState } from "react";
import { createUser } from "@/store/adminUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/store/adminUserSlice";
import { toast } from "react-hot-toast";
import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { addressAPI } from "@/api/address.api";
import { fetchAddressesByUser } from "@/store/addressSlice";

import { ActionMenu } from "@/components/ActionMenu";

const userColumns = [
  { key: "avatar", header: "Avatar", width: "60px", render: (u) => {
      // Prefer explicit avatar URL, otherwise use a deterministic dicebear avatar based on id/email
      const src = u.avatar || (u.email ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=user-${u.id}`);
      return (
        <Avatar className="w-10 h-10">
          <AvatarImage src={src} alt={u.username || u.email} />
          <AvatarFallback>{(u.username || u.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    } },
  { key: "username", header: "Username", render: (u) => <span className="font-medium">{u.username}</span> },
  { key: "email", header: "Email", render: (u) => <span className="text-sm">{u.email}</span> },
  { key: "role", header: "Role", render: (u) => (
      <Badge variant={u.role === 'ADMIN' ? undefined : 'outline'}>{u.role}</Badge>
    ) },
  { key: "status", header: "Status", render: (u) => (
      u.active ? <Badge className="bg-green-500 text-white">Active</Badge> : <Badge variant="outline">Inactive</Badge>
    ) },
  { key: "actions", header: "Actions", width: "80px", render: (u) => (
      <ActionMenu
        item={u}
        actions={[
          { label: 'Detail', icon: <Eye className="w-4 h-4" />, onClick: (it) => window.dispatchEvent(new CustomEvent('admin-user-detail', { detail: it.id })) },
          { label: 'Delete user', icon: <Trash className="w-4 h-4" />, subtitle: 'Disable the account', variant: 'danger', onClick: (it) => window.dispatchEvent(new CustomEvent('admin-user-delete', { detail: it.id })) },
        ]}
        ariaLabel="User actions"
      />
    ) },
];

// Simple sample data if store hasn't users
const sampleUsers = [
  { id: 1, username: 'alice', email: 'alice@example.com', role: 'ADMIN', active: true, avatar: '/src/assets/img/123.jpg' },
  { id: 2, username: 'bob', email: 'bob@example.com', role: 'USER', active: false, avatar: '/src/assets/img/thumb.jpg' },
];

export function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.adminUsers?.users || []);
  const loading = useSelector((s) => s.adminUsers?.loading);
  const error = useSelector((s) => s.adminUsers?.error);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fetchedAddresses, setFetchedAddresses] = useState(null);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', enabled: true });

  useEffect(() => {
    // Only fetch users if store cache is empty
    if (!users || users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users?.length]);

  useEffect(() => {
    const onDelete = (e) => {
      const id = e.detail;
      handleDelete(id);
    };
    const onDetail = (e) => {
      const id = e.detail;
      const u = users.find((x) => x.id === id);
      if (u) {
        setSelectedUser(u);
        setFetchedAddresses(null);
        setAddressesError(null);
        setDetailOpen(true);
        // If user doesn't already have addressList, attempt admin fetch by userId
        if (!u.addressList || u.addressList.length === 0) {
          setAddressesLoading(true);
          (async () => {
            try {
              const res = await dispatch(fetchAddressesByUser(u.id)).unwrap();
              // normalize response shapes similar to previous logic
              const list = Array.isArray(res) ? res : res?.data || res?.content || res?.items || res?.rows || res;
              try {
                console.debug('[debug] normalized list:', JSON.stringify(list));
              } catch (e) {
                console.debug('[debug] normalized list:', list);
              }

              const listPayload = Array.isArray(list) ? list : (list ? [list] : []);

              // defensive filter by common owner keys
              let filtered = (listPayload || []).filter((a) => {
                try {
                  const aid = a?.userId || a?.customerId || a?.ownerId || a?.user?.id || a?.customer?.id;
                  if (aid && String(aid) === String(u.id)) return true;
                  if (a?.email && u?.email && a.email === u.email) return true;
                  return false;
                } catch (err) {
                  return false;
                }
              });

              if ((filtered || []).length === 0 && (listPayload || []).length > 0) {
                filtered = listPayload;
              }

              try {
                console.debug('[debug] filtered addresses for user', u.id, JSON.stringify(filtered));
              } catch (e) {
                console.debug('[debug] filtered addresses for user', u.id, filtered);
              }

              setAddressesLoading(false);
              setAddressesError(null);
              setFetchedAddresses(filtered || []);
            } catch (err) {
              setAddressesLoading(false);
              setAddressesError(err?.message || err || 'Fetch addresses failed');
              setFetchedAddresses([]);
            }
          })();
        }
      }
    };
    window.addEventListener('admin-user-delete', onDelete);
    window.addEventListener('admin-user-detail', onDetail);
    return () => {
      window.removeEventListener('admin-user-delete', onDelete);
      window.removeEventListener('admin-user-detail', onDetail);
    };
  }, [dispatch]);

  // Compute avatar src for selected user
  const selectedAvatarSrc = selectedUser
    ? (selectedUser.avatar || (selectedUser.email ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedUser.email)}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=user-${selectedUser.id}`))
    : undefined;

  // Addresses to display: prefer user's own addressList, otherwise fetched addresses
  const addressesToShow = selectedUser?.addressList && selectedUser.addressList.length > 0
    ? selectedUser.addressList
    : (fetchedAddresses || []);

  // Prepare addresses content JSX to avoid complex nested ternary in JSX
  const addressesContent = addressesLoading ? (
    <div className="text-sm text-muted-foreground">Loading addresses...</div>
  ) : addressesError ? (
    <div className="text-sm text-destructive">{String(addressesError)}</div>
  ) : addressesToShow && addressesToShow.length > 0 ? (
    addressesToShow.map((address) => (
      <div key={address.id || `${address.street}-${address.phoneNumber}`} className="p-3 border rounded">
        <div className="font-semibold">{address.name || 'Address'}</div>
        <div className="text-sm">{address.street}</div>
        <div className="text-sm text-muted-foreground">{address.city}, {address.state} {address.zipCode}</div>
        {address.phoneNumber && <div className="text-sm mt-1">Phone: {address.phoneNumber}</div>}
      </div>
    ))
  ) : (
    <div className="text-sm text-muted-foreground">No addresses saved</div>
  );

  useEffect(() => {
    if (error) toast.error(error?.message || error);
  }, [error]);

  const data = users.length ? users.map((u) => ({
    id: u.id,
    username: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
    email: u.email,
    role: u.role || 'USER',
    active: !!u.enabled,
  avatar: u.avatar || '/src/assets/img/thumb.jpg',
  })) : sampleUsers;

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This will disable the user.')) return;
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success('User deleted (disabled)');
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createUser(form)).unwrap();
      toast.success('User created');
      setOpen(false);
      setForm({ firstName: '', lastName: '', email: '', phoneNumber: '', enabled: true });
    } catch (err) {
      toast.error(err?.message || 'Create failed');
    }
  };

  const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: k === 'enabled' ? e.target.checked : e.target.value }));

  return (
    <>
      {loading && <Spinner />}
      <CrudPageLayout
        title="Users"
        actionText="Add User"
        onAdd={() => setOpen(true)}
      >
        <DataTable data={data} columns={userColumns} showSelect={true} />
      </CrudPageLayout>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {/* hidden trigger since we open via button */}
          <button style={{ display: 'none' }} />
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Add User</SheetTitle>
          </SheetHeader>

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm">First name</label>
              <input value={form.firstName} onChange={onChange('firstName')} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm">Last name</label>
              <input value={form.lastName} onChange={onChange('lastName')} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input type="email" value={form.email} onChange={onChange('email')} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm">Phone</label>
              <input value={form.phoneNumber} onChange={onChange('phoneNumber')} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input id="enabled" type="checkbox" checked={form.enabled} onChange={onChange('enabled')} />
              <label htmlFor="enabled" className="text-sm">Enabled</label>
            </div>

            <SheetFooter>
              <div className="flex gap-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Create</button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      {/* User detail dialog */}
      <Dialog open={detailOpen} onOpenChange={(open) => { if (!open) setSelectedUser(null); setDetailOpen(open); }}>
        <DialogContent className="sm:max-w-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <DialogTitle className="text-lg font-semibold">User details</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">Information about the selected user</DialogDescription>
              </div>
              <div>
                <button onClick={() => setDetailOpen(false)} className="p-2 rounded hover:bg-muted focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24">
                  {selectedAvatarSrc ? <AvatarImage src={selectedAvatarSrc} alt={selectedUser?.username || selectedUser?.email} /> : <AvatarFallback>{(selectedUser?.username || selectedUser?.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>}
                </Avatar>
                <div className="flex-1">
                  <div className="text-xl font-semibold">{selectedUser ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || selectedUser.username || selectedUser.email : '—'}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser?.email}</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="px-2 py-1 rounded bg-muted text-sm">{selectedUser?.role || 'USER'}</div>
                    <div className="text-xs text-muted-foreground">{selectedUser?.rawRole && `(${selectedUser.rawRole})`}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="font-medium">{selectedUser?.phoneNumber || '—'}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="font-medium">{selectedUser?.enabled ? 'Active' : (selectedUser?.active ? 'Active' : 'Inactive')}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-muted-foreground">ID</div>
                  <div className="text-sm break-all">{selectedUser?.id}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Addresses</div>
                <div className="grid grid-cols-1 gap-3">
                  {addressesContent}
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="flex justify-end">
                <button onClick={() => setDetailOpen(false)} className="px-4 py-2 border rounded">Close</button>
              </div>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
