import React, { useEffect } from "react";
import { CrudPageLayout } from "@/layout/CrudPageLayout/CrudPageLayout";
import { DataTable } from "@/components/DataTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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

function ActionMenu({ user }) {
  const dispatchRef = useRef();
  const [openMenu, setOpenMenu] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      <button onClick={(e) => { e.stopPropagation(); setOpenMenu((s) => !s); }} className="p-1 rounded hover:bg-muted">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {openMenu && (
        <div className="absolute right-0 mt-2 w-40 bg-background border rounded shadow z-50">
          <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('admin-user-delete', { detail: user.id })); setOpenMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-muted">Delete user</button>
        </div>
      )}
    </div>
  );
}

const userColumns = [
  { key: "avatar", header: "Avatar", width: "60px", render: (u) => (
      <img src={u.avatar} alt={u.username} className="w-10 h-10 rounded-full object-cover" />
    ) },
  { key: "username", header: "Username", render: (u) => <span className="font-medium">{u.username}</span> },
  { key: "email", header: "Email", render: (u) => <span className="text-sm">{u.email}</span> },
  { key: "role", header: "Role", render: (u) => (
      <Badge variant={u.role === 'ADMIN' ? undefined : 'outline'}>{u.role}</Badge>
    ) },
  { key: "status", header: "Status", render: (u) => (
      u.active ? <Badge className="bg-green-500 text-white">Active</Badge> : <Badge variant="outline">Inactive</Badge>
    ) },
  { key: "actions", header: "Actions", width: "80px", render: (u) => (
      <ActionMenu user={u} />
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
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', enabled: true });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    const onDelete = (e) => {
      const id = e.detail;
      handleDelete(id);
    };
    window.addEventListener('admin-user-delete', onDelete);
    return () => window.removeEventListener('admin-user-delete', onDelete);
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error?.message || error);
  }, [error]);

  const data = users.length ? users.map((u) => ({
    id: u.id,
    username: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
    email: u.email,
    role: u.role || 'USER',
    active: !!u.enabled,
    avatar: '/src/assets/img/thumb.jpg',
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
    </>
  );
}
