import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import UpdateProfile from './UpdateProfile'
import { fetchWithAuth, API_BASE_URL } from '../utils/auth'
import './Dashboard.css'

export default function Profile() {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')?.trim()
      
      if (!token) {
        window.location.href = '/'
        return
      }

      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/profile`, {
          method: 'GET',
        })

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          window.location.href = '/'
          return
        }

        if (!response.ok) {
          console.error('Failed to fetch profile:', response.status)
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setProfileData(data)
        console.log('Profile data fetched:', data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Header />
        <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <UpdateProfile 
          initialData={profileData} 
          onUpdateSuccess={(updatedData) => {
            // Refresh profile data after successful update
            if (updatedData) {
              setProfileData(prev => ({ ...prev, ...updatedData }))
            }
          }}
        />

        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            className="auth-submit-btn"
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#6c757d', width: 'auto', padding: '12px 22px', minWidth: '120px' }}
          >
            Back
          </button>
          <button
            type="button"
            className="auth-submit-btn"
            onClick={() => navigate('/change-password')}
            style={{ width: 'auto', padding: '12px 22px' }}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}


