import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Save,
  Globe,
  Shield,
  Database,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  Download,
  Trash2,
} from 'lucide-react';
import {
  getSystemSettings,
  saveSystemSettings,
  clearCache,
  exportAllData,
} from '@/services/api';
import type { SystemSetting } from '@/data/adminMockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearAllData } = useAuth();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [primaryDevice, setPrimaryDevice] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSystemSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [toast]);

  const handleSettingChange = (key: string, value: string) => {
    setSettings(
      settings.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsToSave = settings.map(s => ({ key: s.key, value: s.value }));
      await saveSystemSettings(settingsToSave);
      toast({
        title: 'Settings saved',
        description: 'Your changes have been saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    // TODO: Replace with real API call for password change
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully.',
    });

    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsSaving(false);
  };

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear all cache? This will log out all users and reset all local data.')) {
      return;
    }

    setIsSaving(true);
    try {
      await clearCache();
      
      // Clear all localStorage and session data
      clearAllData();

      toast({
        title: 'Cache Cleared',
        description: 'All cache has been cleared. Redirecting to home...',
      });

      // Redirect to landing page
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear cache',
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  };

  const handleExportData = async () => {
    setIsSaving(true);
    try {
      const { students, mentors, courses } = await exportAllData();

      // Create CSV content
      const studentsCSV = [
        'ID,Name,Email,City,State,Country,Status,Created At',
        ...students.map(s => `${s.id},${s.name},${s.email},${s.city},${s.state},${s.country},${s.status},${s.createdAt}`)
      ].join('\n');

      const mentorsCSV = [
        'ID,Name,Email,Experience,Status,Created At',
        ...mentors.map(m => `${m.id},${m.name},${m.email},${m.experience},${m.status},${m.createdAt}`)
      ].join('\n');

      const coursesCSV = [
        'ID,Title,Category,Level,Price,Students,Status',
        ...courses.map(c => `${c.id},${c.title},${c.category},${c.level},${c.price},${c.totalStudents},${c.status}`)
      ].join('\n');

      // Combine all data
      const allData = `=== STUDENTS ===\n${studentsCSV}\n\n=== MENTORS ===\n${mentorsCSV}\n\n=== COURSES ===\n${coursesCSV}`;

      // Create download
      const blob = new Blob([allData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learnhub_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Data Exported',
        description: 'Platform data has been exported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  };

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.value === 'true'}
            onCheckedChange={(checked) =>
              handleSettingChange(setting.key, checked ? 'true' : 'false')
            }
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="max-w-[200px]"
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="max-w-[300px]"
          />
        );
      default:
        return (
          <Input
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="max-w-[300px]"
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure platform-wide settings</p>
        </div>

        <Button onClick={handleSaveSettings} disabled={isSaving} className="gradient-primary border-0">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            General Settings
          </CardTitle>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {settings
            .filter((s) => ['platform_name', 'support_email'].includes(s.key))
            .map((setting) => (
              <div key={setting.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Label className="font-medium">{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                {renderSettingInput(setting)}
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Course Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Course Settings
          </CardTitle>
          <CardDescription>Configure course-related options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {settings
            .filter((s) => ['max_cohort_size', 'certificate_prefix'].includes(s.key))
            .map((setting) => (
              <div key={setting.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Label className="font-medium">{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                {renderSettingInput(setting)}
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Update your admin account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Require a verification code when signing in
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          {twoFactorEnabled && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Primary Device</Label>
                  <p className="text-sm text-muted-foreground">
                    Use this device as your primary authentication method
                  </p>
                </div>
                <Switch
                  checked={primaryDevice}
                  onCheckedChange={setPrimaryDevice}
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Recovery Options</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Set up recovery options in case you lose access to your authentication device.
                </p>
                <Button variant="outline" size="sm">
                  Set Up Recovery
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions - proceed with caution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <div>
              <p className="font-medium">Clear All Cache</p>
              <p className="text-sm text-muted-foreground">
                Remove all cached data, logout all sessions, and reset to fresh state
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleClearCache}
              disabled={isSaving}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <div>
              <p className="font-medium">Export All Data</p>
              <p className="text-sm text-muted-foreground">
                Download all platform data (students, mentors, courses) as CSV
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={handleExportData}
              disabled={isSaving}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
