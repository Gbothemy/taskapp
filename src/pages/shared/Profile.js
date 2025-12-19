import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  UserIcon, 
  PencilIcon, 
  CameraIcon,
  MapPinIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  StarIcon,
  TrophyIcon,
  ChartBarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { updateProfile } from '../../store/slices/authSlice';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MobileNav from '../../components/layout/MobileNav';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, profile, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    website: '',
    phone: '',
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        phone: profile.phone || '',
        skills: profile.skills || []
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        phone: formData.phone,
        skills: formData.skills
      })).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        phone: profile.phone || '',
        skills: profile.skills || []
      });
    }
    setIsEditing(false);
  };

  const getInitials = () => {
    const firstName = formData.firstName || profile?.first_name || '';
    const lastName = formData.lastName || profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'employer':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'worker':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white';
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-xl mb-8">
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 rounded-t-2xl relative">
              <div className="absolute inset-0 bg-black/20 rounded-t-2xl"></div>
              <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors">
                <CameraIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl border-4 border-white">
                  {getInitials() || <UserIcon className="w-16 h-16" />}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 transition-colors">
                  <CameraIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-black text-secondary-900">
                    {formData.firstName} {formData.lastName}
                  </h1>
                  <CheckBadgeIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge className={getRoleColor(user?.role)} size="lg">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </Badge>
                  <div className="flex items-center space-x-1 text-warning-500">
                    <StarIcon className="w-4 h-4 fill-current" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-secondary-500">(127 reviews)</span>
                  </div>
                </div>
                {formData.location && (
                  <div className="flex items-center space-x-2 text-secondary-600 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{formData.location}</span>
                  </div>
                )}
                {formData.website && (
                  <div className="flex items-center space-x-2 text-secondary-600 mb-2">
                    <GlobeAltIcon className="w-4 h-4" />
                    <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      {formData.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-secondary-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Joined {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-primary-600 to-primary-700">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    <Button onClick={handleSave} className="bg-gradient-to-r from-success-600 to-success-700">
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-4">About</h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us about yourself, your experience, and what makes you unique..."
                />
              ) : (
                <p className="text-secondary-700 leading-relaxed">
                  {formData.bio || 'No bio available. Click "Edit Profile" to add information about yourself.'}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-4">Skills & Expertise</h2>
              {isEditing && (
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      className="flex-1 px-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Add a skill..."
                    />
                    <Button onClick={handleAddSkill} size="sm">
                      Add
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {formData.skills.length > 0 ? (
                  formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge variant="primary" size="lg">
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-primary-300 hover:text-white"
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary-500">No skills added yet.</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            {isEditing && (
              <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="md:col-span-2">
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
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrophyIcon className="w-5 h-5 text-warning-500" />
                    <span className="text-secondary-700">Tasks Completed</span>
                  </div>
                  <span className="font-bold text-secondary-900">{profile?.tasks_completed || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <StarIcon className="w-5 h-5 text-warning-500" />
                    <span className="text-secondary-700">Average Rating</span>
                  </div>
                  <span className="font-bold text-secondary-900">4.8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5 text-primary-500" />
                    <span className="text-secondary-700">Success Rate</span>
                  </div>
                  <span className="font-bold text-secondary-900">96%</span>
                </div>
              </div>
            </div>

            {/* Contact Info Display */}
            {!isEditing && (
              <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Contact</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="w-5 h-5 text-secondary-500" />
                    <span className="text-secondary-700">{user?.email}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-secondary-500" />
                      <span className="text-secondary-700">{formData.phone}</span>
                    </div>
                  )}
                  {formData.website && (
                    <div className="flex items-center space-x-3">
                      <GlobeAltIcon className="w-5 h-5 text-secondary-500" />
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="text-center py-8 text-secondary-500">
                  <ChartBarIcon className="w-12 h-12 mx-auto mb-2 text-secondary-400" />
                  <p>No recent activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default Profile;