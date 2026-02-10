import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Camera,
  Lightbulb,
  Clock,
  TrendingUp,
  Settings,
  Bell,
  Shield,
  CheckCircle
} from 'lucide-react';

export function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'password'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    bio: 'Passionate entrepreneur interested in solving Egyptian market challenges',
    phone: '+20 1234567890',
    location: 'Cairo, Egypt',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [settingsData, setSettingsData] = useState({
    emailNotifications: true,
    weeklyDigest: true,
    newFeatures: false,
  });

  const stats = [
    { label: 'Ideas Generated', value: '12', icon: Lightbulb, color: 'primary' },
    { label: 'Saved Ideas', value: '8', icon: Save, color: 'secondary' },
    { label: 'Hours Saved', value: '24', icon: Clock, color: 'accent' },
    { label: 'Success Rate', value: '85%', icon: TrendingUp, color: 'secondary' },
  ];

  const handleSaveProfile = () => {
    // Simulate save
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = () => {
    // Simulate password change
    setSaveSuccess(true);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    // { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'password', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-neutral-900 mb-2">My Profile</h2>
            <p className="text-neutral-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 bg-secondary-50 border border-secondary-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-secondary-600" />
              <p className="text-secondary-800">Changes saved successfully!</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <Card variant="bordered" padding="sm">
                <div className="flex flex-col gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <Card variant="elevated" padding="lg">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-neutral-900">Profile Information</h4>
                      {!isEditing && (
                        <Button variant="outlined" size="sm" onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-4 pb-6 border-b border-neutral-200">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                          <User className="w-12 h-12 text-white" />
                        </div>
                        {isEditing && (
                          <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors">
                            <Camera className="w-4 h-4 text-neutral-600" />
                          </button>
                        )}
                      </div>
                      <div>
                        <h5 className="text-neutral-900">{profileData.name}</h5>
                        <p className="text-neutral-600 mt-1">{profileData.email}</p>
                      </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-neutral-700 mb-2">Full Name</label>
                        <Input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-neutral-50' : ''}
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 mb-2">Email</label>
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-neutral-50' : ''}
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 mb-2">Phone Number</label>
                        <Input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-neutral-50' : ''}
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 mb-2">Location</label>
                        <Input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-neutral-50' : ''}
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 mb-2">Bio</label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          disabled={!isEditing}
                          rows={4}
                          className={`w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                            !isEditing ? 'bg-neutral-50 text-neutral-600' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button variant="primary" onClick={handleSaveProfile}>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </Button>
                        <Button variant="outlined" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="pt-6 border-t border-neutral-200">
                      <h5 className="text-neutral-900 mb-4">Your Statistics</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat) => (
                          <Card key={stat.label} variant="bordered" padding="md" className="text-center">
                            <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center mx-auto mb-3`}>
                              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                            </div>
                            <div className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-neutral-600">{stat.label}</div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-neutral-900">Notification Settings</h4>
                      <p className="text-neutral-600 mt-1">Manage how you receive updates</p>
                    </div>

                    <div className="space-y-4">
                      <Card variant="bordered" padding="md">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            checked={settingsData.emailNotifications}
                            onChange={(e) => setSettingsData({ ...settingsData, emailNotifications: e.target.checked })}
                            className="mt-1 w-5 h-5 text-primary-600 rounded"
                          />
                          <div className="flex-1">
                            <label htmlFor="emailNotifications" className="text-neutral-900 cursor-pointer flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email Notifications
                            </label>
                            <p className="text-neutral-600 mt-1 text-sm">
                              Receive email updates when new ideas are generated
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card variant="bordered" padding="md">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="weeklyDigest"
                            checked={settingsData.weeklyDigest}
                            onChange={(e) => setSettingsData({ ...settingsData, weeklyDigest: e.target.checked })}
                            className="mt-1 w-5 h-5 text-primary-600 rounded"
                          />
                          <div className="flex-1">
                            <label htmlFor="weeklyDigest" className="text-neutral-900 cursor-pointer flex items-center gap-2">
                              <Bell className="w-4 h-4" />
                              Weekly Digest
                            </label>
                            <p className="text-neutral-600 mt-1 text-sm">
                              Get a weekly summary of your activity and insights
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card variant="bordered" padding="md">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="newFeatures"
                            checked={settingsData.newFeatures}
                            onChange={(e) => setSettingsData({ ...settingsData, newFeatures: e.target.checked })}
                            className="mt-1 w-5 h-5 text-primary-600 rounded"
                          />
                          <div className="flex-1">
                            <label htmlFor="newFeatures" className="text-neutral-900 cursor-pointer flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              New Features & Updates
                            </label>
                            <p className="text-neutral-600 mt-1 text-sm">
                              Be the first to know about new features and improvements
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="pt-4">
                      <Button variant="primary" onClick={() => {
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                      }}>
                        <Save className="w-5 h-5" />
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-neutral-900">Change Password</h4>
                      <p className="text-neutral-600 mt-1">Update your password to keep your account secure</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-neutral-700 mb-2">Current Password</label>
                        <Input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 mb-2">New Password</label>
                        <Input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 mb-2">Confirm New Password</label>
                        <Input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <Card variant="bordered" padding="md" className="bg-accent-50 border-accent-200">
                        <h6 className="text-neutral-900 mb-2">Password Requirements:</h6>
                        <ul className="text-sm text-neutral-700 space-y-1">
                          <li>• At least 8 characters long</li>
                          <li>• Contains uppercase and lowercase letters</li>
                          <li>• Contains at least one number</li>
                          <li>• Contains at least one special character</li>
                        </ul>
                      </Card>
                    </div>

                    <div className="pt-4">
                      <Button 
                        variant="primary" 
                        onClick={handleChangePassword}
                        disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      >
                        <Lock className="w-5 h-5" />
                        Update Password
                      </Button>
                    </div>

                    {/* <div className="pt-6 border-t border-neutral-200">
                      <h5 className="text-neutral-900 mb-3">Account Security</h5>
                      <Card variant="bordered" padding="md" className="bg-secondary-50 border-secondary-200">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-neutral-900 font-medium">Two-Factor Authentication</p>
                            <p className="text-neutral-600 mt-1 text-sm">
                              Add an extra layer of security to your account (Coming Soon)
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div> */}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
