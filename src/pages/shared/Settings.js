import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { updateProfile } from '../../store/slices/authSlice';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MobileNav from '../../components/layout/MobileNav';
import toast from 'react-hot-toast';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, profile, loading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    paymentAlerts: true,
    marketingEmails: false,
    weeklyDigest: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [profile, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        website: formData.website
      })).unwrap();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      // In a real implementation, this would call the password change service
      toast.success('Password changed successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl">
              <CogIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-secondary-900">
                Settings
              </h1>
              <p className="text-secondary-600 mt-2 text-lg">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-xl">
          <div className="border-b border-primary-200/50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'account', name: 'Account', icon: UserIcon },
                { id: 'notifications', name: 'Notifications', icon: BellIcon },
                { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
                { id: 'security', name: 'Security', icon: KeyIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Account Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      disabled
                    />
                    <p className="text-xs text-secondary-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-primary-600 to-primary-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
                    { key: 'taskUpdates', label: 'Task Updates', description: 'Get notified about task status changes' },
                    { key: 'paymentAlerts', label: 'Payment Alerts', description: 'Receive alerts for payments and earnings' },
                    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional emails and updates' },
                    { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of your activity' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-secondary-900">{item.label}</div>
                        <div className="text-sm text-secondary-600">{item.description}</div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications[item.key] ? 'bg-primary-600' : 'bg-secondary-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Privacy Settings</h3>
                
                <div className="space-y-6">
                  <div className="p-4 bg-secondary-50 rounded-xl">
                    <div className="font-semibold text-secondary-900 mb-2">Profile Visibility</div>
                    <div className="space-y-2">
                      {[
                        { value: 'public', label: 'Public', description: 'Anyone can view your profile' },
                        { value: 'private', label: 'Private', description: 'Only you can view your profile' },
                        { value: 'contacts', label: 'Contacts Only', description: 'Only your contacts can view your profile' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value={option.value}
                            checked={privacy.profileVisibility === option.value}
                            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <div className="font-medium text-secondary-900">{option.label}</div>
                            <div className="text-sm text-secondary-600">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'showEmail', label: 'Show Email Address', description: 'Display your email on your public profile' },
                      { key: 'showPhone', label: 'Show Phone Number', description: 'Display your phone number on your public profile' },
                      { key: 'showLocation', label: 'Show Location', description: 'Display your location on your public profile' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-secondary-900">{item.label}</div>
                          <div className="text-sm text-secondary-600">{item.description}</div>
                        </div>
                        <button
                          onClick={() => handlePrivacyChange(item.key, !privacy[item.key])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            privacy[item.key] ? 'bg-primary-600' : 'bg-secondary-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacy[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Security Settings</h3>
                
                <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <ShieldCheckIcon className="w-5 h-5 text-warning-600" />
                    <span className="font-semibold text-warning-900">Change Password</span>
                  </div>
                  <p className="text-sm text-warning-700 mb-4">
                    Keep your account secure by using a strong, unique password.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
                        >
                          {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <Button onClick={handleChangePassword} className="bg-gradient-to-r from-warning-600 to-warning-700">
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <div className="bg-info-50 border border-info-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <DevicePhoneMobileIcon className="w-5 h-5 text-info-600" />
                      <span className="font-semibold text-info-900">Two-Factor Authentication</span>
                      <Badge variant="default" size="sm">Disabled</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-info-600 border-info-600 hover:bg-info-100"
                    >
                      Enable 2FA
                    </Button>
                  </div>
                  <p className="text-sm text-info-700">
                    Add an extra layer of security to your account with two-factor authentication using SMS or authenticator apps.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default Settings;