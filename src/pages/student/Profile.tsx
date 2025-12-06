import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Loader2, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const countries = ['USA', 'Canada', 'UK', 'India', 'Australia', 'Germany', 'Other'];

const statesByCountry: Record<string, string[]> = {
  'USA': ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Washington', 'Massachusetts', 'Other'],
  'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Other'],
  'UK': ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Other'],
  'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Other'],
  'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'Other'],
  'Germany': ['Bavaria', 'Berlin', 'Hamburg', 'Hesse', 'Other'],
  'Other': ['Other'],
};

const citiesByState: Record<string, string[]> = {
  'California': ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose', 'Other'],
  'New York': ['New York City', 'Buffalo', 'Albany', 'Rochester', 'Other'],
  'Texas': ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Other'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Other'],
  'Illinois': ['Chicago', 'Aurora', 'Springfield', 'Other'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Other'],
  'Massachusetts': ['Boston', 'Cambridge', 'Worcester', 'Other'],
  'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Other'],
  'Quebec': ['Montreal', 'Quebec City', 'Other'],
  'British Columbia': ['Vancouver', 'Victoria', 'Other'],
  'Alberta': ['Calgary', 'Edmonton', 'Other'],
  'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Other'],
  'Scotland': ['Edinburgh', 'Glasgow', 'Other'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Other'],
  'Karnataka': ['Bangalore', 'Mysore', 'Other'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Other'],
  'Delhi': ['New Delhi', 'Other'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Other'],
  'New South Wales': ['Sydney', 'Newcastle', 'Other'],
  'Victoria': ['Melbourne', 'Geelong', 'Other'],
  'Queensland': ['Brisbane', 'Gold Coast', 'Other'],
  'Bavaria': ['Munich', 'Nuremberg', 'Other'],
  'Berlin': ['Berlin', 'Other'],
  'Hamburg': ['Hamburg', 'Other'],
  'Other': ['Other'],
};

const colleges = [
  'MIT',
  'Stanford University',
  'Harvard University',
  'NYU',
  'UCLA',
  'UC Berkeley',
  'University of Chicago',
  'Rutgers University',
  'Northeastern University',
  'Stevens Institute of Technology',
  'IIT Bombay',
  'IIT Delhi',
  'Other',
];

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    state: user?.state || '',
    country: user?.country || '',
    college: (user as any)?.college || '',
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: 'Profile Picture Updated',
        description: 'Your new profile picture has been set.',
      });
    }
  };

  const handleCountryChange = (value: string) => {
    setFormData({ ...formData, country: value, state: '', city: '' });
  };

  const handleStateChange = (value: string) => {
    setFormData({ ...formData, state: value, city: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });

    setIsLoading(false);
  };

  const availableStates = formData.country ? statesByCountry[formData.country] || ['Other'] : [];
  const availableCities = formData.state ? citiesByState[formData.state] || ['Other'] : [];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Avatar Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarPreview || user?.avatar} />
                <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">
                  {user?.name?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user?.name || 'Student'}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.state}
                  onValueChange={handleStateChange}
                  disabled={!formData.country}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => setFormData({ ...formData, city: value })}
                  disabled={!formData.state}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">College/University</Label>
              <Select
                value={formData.college}
                onValueChange={(value) => setFormData({ ...formData, college: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map(college => (
                    <SelectItem key={college} value={college}>{college}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button type="submit" className="gradient-primary border-0" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
