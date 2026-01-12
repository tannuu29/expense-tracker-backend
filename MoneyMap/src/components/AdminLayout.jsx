import { Outlet } from 'react-router-dom'
import AdminHeader from './AdminHeader' // or whatever header component you use

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* HEADER ALWAYS VISIBLE */}
      <AdminHeader />

      {/* CHILD ROUTES RENDER HERE */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
