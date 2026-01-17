import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/public/LandingPage'
import Dashboard from './pages/user/Dashboard'
import About from './pages/public/About'
import ContactUs from './pages/public/ContactUs'
import Profile from './pages/user/Profile'
import ChangePassword from './pages/auth/ChangePassword'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AdminUsers from './pages/admin/AdminUsers'
import AdminRoute from './components/routes/AdminRoute'
import AdminLayout from './components/layouts/AdminLayout'
import Login from './pages/auth/Login'
import AdminUserDetails from './pages/admin/AdminUserDetails'
import AdminProfile from './pages/admin/AdminProfile'
import ProtectedRoute from './components/routes/ProtectedRoute'
import Developer from './pages/public/Developer'
import Footer from './Footer'

function App() {
  return (
    <>
    
    <Router>

      {/* PUBLIC ROUTES */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
       
      <Route path='/developer' element= {<Developer/>} />
   

          {/* USER PROTECTED ROUTES */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    
    {/* ADMIN ROUTES */}
    </Route>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
          <Route path="profile" element={<AdminProfile />} />

        </Route>
        
      </Routes>
    </Router>
     <Footer />
    </>
  )
}

export default App
