"use client";

import { useState, useEffect } from "react";
import {
  getProfile,
  updateProfileAction,
  changePasswordAction,
} from "./actions";

type SettingsTab = "Profile" | "Notifications" | "Security";
const tabs: SettingsTab[] = ["Profile", "Notifications", "Security"];

const notificationSettings = [
  {
    id: "email_campaigns",
    label: "Campaign Updates",
    description: "Get notified when campaigns are generated or updated",
    enabled: true,
  },
  {
    id: "email_chat",
    label: "AI Chat Responses",
    description: "Receive notifications for AI strategist responses",
    enabled: false,
  },
  {
    id: "email_requests",
    label: "Request Status Updates",
    description: "Updates on your professional request statuses",
    enabled: true,
  },
  {
    id: "email_marketing",
    label: "Marketing Tips & Insights",
    description: "Weekly AI-generated marketing insights and tips",
    enabled: false,
  },
  {
    id: "email_product",
    label: "Product Updates",
    description: "New features and platform improvements",
    enabled: true,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [notifications, setNotifications] = useState(notificationSettings);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getProfile();
        if (user) {
          setProfile({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: "",
            company: "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      await updateProfileAction({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      setProfileMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }

    setSavingPassword(true);
    setPasswordMessage(null);
    try {
      await changePasswordAction(newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({
        type: "success",
        text: "Password updated successfully.",
      });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to change password.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-on-surface">
            Settings
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-on-surface">
          Settings
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-outline-variant">
        <div className="flex items-center gap-6 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "Profile" && (
        <div className="space-y-6 max-w-2xl">
          {/* Avatar Section */}
          <div className="glass-panel glow-hover p-6">
            <h3 className="font-heading text-base font-semibold text-on-surface mb-4">
              Profile Photo
            </h3>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-white shrink-0">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </div>
              <div>
                <button className="gradient-primary rounded-lg px-4 py-2 text-sm font-medium text-white hover:ai-glow transition-all">
                  Upload Photo
                </button>
                <p className="text-xs text-on-surface-variant mt-2">
                  JPG, PNG, or GIF. Max 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="glass-panel glow-hover p-6">
            <h3 className="font-heading text-base font-semibold text-on-surface mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full opacity-60 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Enter phone number"
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                Company
              </label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, company: e.target.value }))
                }
                placeholder="Enter company name"
                className="w-full max-w-sm"
              />
            </div>

            {profileMessage && (
              <div
                className={`mt-4 px-4 py-2 rounded-lg text-sm ${
                  profileMessage.type === "success"
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                }`}
              >
                {profileMessage.text}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="gradient-primary rounded-lg px-6 py-2.5 text-sm font-semibold text-white hover:ai-glow transition-all disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "Notifications" && (
        <div className="space-y-6 max-w-2xl">
          <div className="glass-panel glow-hover p-6">
            <h3 className="font-heading text-base font-semibold text-on-surface mb-2">
              Email Notifications
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              Choose which email notifications you want to receive.
            </p>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between py-3 border-b border-outline-variant last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {notification.label}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {notification.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotification(notification.id)}
                    className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ml-4 ${
                      notification.enabled ? "bg-primary" : "bg-surface-container-high"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                        notification.enabled ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button className="gradient-primary rounded-lg px-6 py-2.5 text-sm font-semibold text-white hover:ai-glow transition-all">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "Security" && (
        <div className="space-y-6 max-w-2xl">
          {/* Change Password */}
          <div className="glass-panel glow-hover p-6">
            <h3 className="font-heading text-base font-semibold text-on-surface mb-2">
              Change Password
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              Update your password to keep your account secure.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full"
                />
              </div>
            </div>

            {passwordMessage && (
              <div
                className={`mt-4 px-4 py-2 rounded-lg text-sm ${
                  passwordMessage.type === "success"
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="gradient-primary rounded-lg px-6 py-2.5 text-sm font-semibold text-white hover:ai-glow transition-all disabled:opacity-50"
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="glass-panel glow-hover p-6">
            <h3 className="font-heading text-base font-semibold text-on-surface mb-2">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              Add an extra layer of security to your account.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">
                  shield
                </span>
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    Authenticator App
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {twoFactor
                      ? "Two-factor authentication is enabled"
                      : "Protect your account with 2FA"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  twoFactor
                    ? "bg-surface-container-high text-on-surface-variant"
                    : "gradient-primary text-white hover:ai-glow"
                }`}
              >
                {twoFactor ? "Disable" : "Enable"}
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="glass-panel glow-hover p-6">
            <h3 className="font-heading text-base font-semibold text-on-surface mb-2">
              Active Sessions
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              Manage your active sessions across devices.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-outline-variant">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    laptop_mac
                  </span>
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      Current Session
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      This device - Active now
                    </p>
                  </div>
                </div>
                <span className="status-pill bg-success/10 text-success">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
