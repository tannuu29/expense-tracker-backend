import React, { useState, useEffect } from 'react'
import { fetchWithAuth, API_BASE_URL } from '../../utils/auth'
import '../../components/common/AuthForms.css'

export default function UpdateProfile({ initialData, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '', // shown but NOT sent to backend
    email: '',
    mobile: '',
  })

  // Initialize form data when initialData prop is received
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        username: initialData.username || '',
        email: initialData.email || '',
        mobile: initialData.mobile || initialData.phone || '',
      })
    }
  }, [initialData])

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

    if (!formData.name.trim()) next.name = 'Name is required'

    if (!formData.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) next.email = 'Enter a valid email'

    if (!formData.mobile.trim()) next.mobile = 'Mobile is required'
    else if (!/^\d{10}$/.test(formData.mobile.trim())) next.mobile = 'Mobile must be 10 digits'

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
      const res = await fetchWithAuth(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
        }),
      })

      // Don't auto-logout on first 401 - might be temporary
      if (res.status === 401) {
        setStatus({ type: 'error', message: 'Authentication failed. Please try again.' })
        setIsLoading(false)
        return
      }

      if (res.status === 403) {
        setStatus({ type: 'error', message: 'You are not allowed to update profile.' })
        setIsLoading(false)
        return
      }

      if (!res.ok) {
        let message = 'Profile update failed. Please try again.'
        try {
          const data = await res.json()
          message = data.message || message
        } catch {}
        setStatus({ type: 'error', message })
        return
      }

      const data = await res.json()
      setStatus({ type: 'success', message: data.message || 'Profile updated successfully' })
      
      // Update form with response data if available to ensure consistency
      if (data.name !== undefined || data.email !== undefined || data.mobile !== undefined) {
        setFormData(prev => ({
          ...prev,
          name: data.name !== undefined ? data.name : prev.name,
          email: data.email !== undefined ? data.email : prev.email,
          mobile: data.mobile !== undefined ? data.mobile : prev.mobile,
        }))
      }
      
      // Notify parent to refetch profile data
      if (onUpdateSuccess) {
        onUpdateSuccess(data)
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-modal" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="auth-header">
        <h2 className="auth-title">Profile</h2>
        <p className="auth-subtitle">Update your details</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input ${errors.name ? 'form-input-error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username (cannot be changed)
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Managed by your account"
              readOnly
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="mobile">
              Mobile
            </label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              className={`form-input ${errors.mobile ? 'form-input-error' : ''}`}
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile"
            />
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>
        </div>

        <div style={{ height: 8 }} />

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

        <button className="auth-submit-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}
