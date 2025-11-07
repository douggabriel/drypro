import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Briefcase, Wrench } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../Shared/Button';
import Input from '../Shared/Input';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('supervisor');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email, password, role);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Failed to sign in');
      }
    } catch (err) {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-2xl flex items-center justify-center text-4xl">
            🏗️
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              DryBuild Pro
            </h1>
            <p className="text-gray-600">
              Sign in to manage your projects
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            {/* Password */}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Supervisor */}
                <button
                  type="button"
                  onClick={() => setRole('supervisor')}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    role === 'supervisor'
                      ? 'border-primary-orange bg-gradient-to-br from-orange-50 to-orange-100 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        role === 'supervisor'
                          ? 'bg-gradient-to-br from-primary-orange to-primary-orangeDark'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Briefcase
                        className={`w-6 h-6 ${
                          role === 'supervisor' ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <span
                      className={`font-semibold ${
                        role === 'supervisor' ? 'text-primary-orange' : 'text-gray-600'
                      }`}
                    >
                      Supervisor
                    </span>
                  </div>
                </button>

                {/* Trade Worker */}
                <button
                  type="button"
                  onClick={() => setRole('trade')}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    role === 'trade'
                      ? 'border-primary-blue bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        role === 'trade'
                          ? 'bg-gradient-to-br from-primary-blue to-primary-blueDark'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Wrench
                        className={`w-6 h-6 ${
                          role === 'trade' ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <span
                      className={`font-semibold ${
                        role === 'trade' ? 'text-primary-blue' : 'text-gray-600'
                      }`}
                    >
                      Trade Worker
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={!email || !password}
            >
              Sign In
            </Button>
          </form>

          {/* Demo credentials info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Accounts:</p>
            <p className="text-xs text-blue-700">
              Supervisor: supervisor@demo.com / password
            </p>
            <p className="text-xs text-blue-700">
              Trade: trade@demo.com / password
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-white text-sm">
          © 2025 DryBuild Pro. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
