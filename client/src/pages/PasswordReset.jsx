import React, { useState } from 'react'
import { Mail, ArrowRight, Music, ArrowLeft, Lock } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthService } from '../services/BackendService'

const PasswordReset = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token')
  
  const [step, setStep] = useState(tokenFromUrl ? 'reset' : 'email') // 'email', 'code', 'reset'
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState(tokenFromUrl || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Vui lòng nhập email của bạn')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await AuthService.requestPasswordReset(email)
      console.log('Password reset response:', response)
      setSuccess('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến.')
      setLoading(false)
    } catch (err) {
      console.error('Password reset error:', err)
      console.error('Error response:', err.response?.data)
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.')
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng điền vào tất cả các trường')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp')
      return
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      console.log('Resetting password with token:', resetToken)
      const response = await AuthService.confirmPasswordReset(resetToken, newPassword)
      console.log('Reset successful:', response)
      setSuccess('Đặt lại mật khẩu thành công!')
      setTimeout(() => navigate('/auth/login'), 2000)
    } catch (err) {
      console.error('Reset password error:', err)
      console.error('Error response:', err.response?.data)
      setError(err.response?.data?.message || 'Mã đặt lại không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu mã mới.')
      setLoading(false)
    }
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

          <h1 className="text-2xl font-semibold text-center text-gray-950 mb-2">Đặt lại mật khẩu</h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            {step === 'email' && 'Nhập email của bạn để nhận liên kết đặt lại mật khẩu'}
            {step === 'reset' && 'Tạo mật khẩu mới cho tài khoản của bạn'}
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
                  Địa chỉ Email
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
                {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
              </button>
              <div className="mt-4 text-center">
                <Link to="/auth/login" className="text-sm text-primary hover:underline">
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}

          {/* Reset Password Step */}
          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-950 mb-2">
                  Mật khẩu mới
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
                  Xác nhận mật khẩu
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
                {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </button>
              <div className="mt-4 text-center">
                <Link to="/auth/login" className="text-sm text-primary hover:underline">
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default PasswordReset
            