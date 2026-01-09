import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchWithAuth, API_BASE_URL } from '../utils/auth'
import './AuthForms.css'

export default function ChangePassword() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' }) // type: 'success' | 'error' | ''

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!formData.oldPassword) next.oldPassword = 'Old password is required'

    if (!formData.newPassword) next.newPassword = 'New password is required'
    else if (formData.newPassword.length < 6) next.newPassword = 'New password must be at least 6 characters'
    else if (formData.newPassword === formData.oldPassword) next.newPassword = 'New password must be different'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })

    if (!validate()) return

    const token = localStorage.getItem('token')?.trim();
    if (!token) {
      setStatus({ type: 'error', message: 'You are not logged in. Please login again.' })
      return
    }

    setIsLoading(true)
    try {
      console.log('JWT being sent:', token)
      const res = await fetchWithAuth(`${API_BASE_URL}/changePass`, {
        method: 'PUT',
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      })

      console.log('Change password status:', res.status)

      // Don't auto-logout on first 401 - might be temporary
      if (res.status === 401 || res.status === 403) {
        setStatus({ type: 'error', message: 'Authentication failed. Please check your old password and try again.' })
        setIsLoading(false)
        return
      }

      // 🔥 ONLY PARSE JSON AFTER OK
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setStatus({
          type: 'error',
          message: data.message || 'Password change failed. Please try again.',
        })
        return
      }

      const data = await res.json()

      setStatus({ type: 'success', message: data.message || 'Password changed successfully' })
      setFormData({ oldPassword: '', newPassword: '' })
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-modal" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="auth-header">
        <h2 className="auth-title">Change Password</h2>
        <p className="auth-subtitle">Update your account password</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="oldPassword">
            Old Password
          </label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            className={`form-input ${errors.oldPassword ? 'form-input-error' : ''}`}
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Enter old password"
          />
          {errors.oldPassword && <span className="error-message">{errors.oldPassword}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            className={`form-input ${errors.newPassword ? 'form-input-error' : ''}`}
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
          />
          {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
        </div>

        {status.message && (
          <div
            className="error-message"
            style={{
              textAlign: 'center',
              color: status.type === 'success' ? '#28a745' : undefined,
              marginBottom: 16,
            }}
          >
            {status.message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            className="auth-submit-btn"
            onClick={() => navigate('/profile')}
            style={{ backgroundColor: '#6c757d', width: 'auto', minWidth: '120px' }}
          >
            Back
          </button>
          <button className="auth-submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  )
}


