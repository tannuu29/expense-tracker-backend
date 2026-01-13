import { Outlet } from 'react-router-dom'
import Header from '../common/Header'

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Header />
      <main className="dashboard-layout-content">
        <Outlet />
      </main>
    </div>
  )
}
