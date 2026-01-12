import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UpdateProfile from './UpdateProfile'
import ChangePassword from './ChangePassword'
import { fetchWithAuth, API_BASE_URL } from '../utils/auth'
import './Dashboard.css'

export default function AdminProfile() {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showChangePassword, setShowChangePassword] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')?.trim()
      
      if (!token) {
        navigate('/login')
        return
      }

      try {
        // Use the same profile endpoint - it should work for admins too
        const response = await fetchWithAuth(`${API_BASE_URL}/profile`, {
          method: 'GET',
        })

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          navigate('/login')
          return
        }

        if (!response.ok) {
          console.error('Failed to fetch profile:', response.status)
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setProfileData(data)
        console.log('Admin profile data fetched:', data)
      } catch (error) {
        console.error('Error fetching admin profile:', error)
        if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          navigate('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading profile...</div>
        </div>
      </div>
    )
  }

  if (showChangePassword) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ChangePassword onBack={() => setShowChangePassword(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Update Profile Component */}
        <UpdateProfile 
          initialData={profileData} 
          onUpdateSuccess={(updatedData) => {
            // Refresh profile data after successful update
            if (updatedData) {
              setProfileData(prev => ({ ...prev, ...updatedData }))
            }
          }}
        />

        {/* Action Buttons */}
        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            className="auth-submit-btn"
            onClick={() => navigate('/admin/users')}
            style={{ backgroundColor: '#6c757d', width: 'auto', padding: '12px 22px', minWidth: '120px' }}
          >
            Back to Users
          </button>
          <button
            type="button"
            className="auth-submit-btn"
            onClick={() => setShowChangePassword(true)}
            style={{ width: 'auto', padding: '12px 22px' }}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}
