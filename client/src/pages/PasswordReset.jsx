import React, { useState } from 'react'
import { Mail, ArrowRight, Music, ArrowLeft, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const PasswordReset = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // 'email', 'code', 'reset'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email')
      return
    }
    setLoading(true)
    setError('')
    // Mock sending code
    setTimeout(() => {
      setStep('code')
      setSuccess('Verification code sent to your email')
      setLoading(false)
    }, 1000)
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    if (!code) {
      setError('Please enter the verification code')
      return
    }
    setLoading(true)
    setError('')
    // Mock verifying code
    setTimeout(() => {
      setStep('reset')
      setSuccess('Code verified. Enter your new password.')
      setLoading(false)
    }, 1000)
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    // Mock resetting password
    setTimeout(() => {
      setSuccess('Password reset successfully!')
      setTimeout(() => navigate('/auth/login'), 2000)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-white p-8 border border-gray-200 shadow-sm">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center">
              <Music className="text-primary" size={24} />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-center text-gray-950 mb-2">Reset Password</h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            {step === 'email' && 'Enter your email to receive a reset code'}
            {step === 'code' && 'Enter the verification code sent to your email'}
            {step === 'reset' && 'Create a new password for your account'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-950 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? 'Sending code...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {/* Code Step */}
          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-950 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-2 text-center text-2xl tracking-widest rounded-lg border border-gray-200 bg-white text-gray-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-transparent transition-all"
                />
                <p className="text-xs mt-2 text-gray-500">Check your email for the 6-digit code</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          )}

          {/* Reset Password Step */}
          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-950 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-950 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default PasswordReset