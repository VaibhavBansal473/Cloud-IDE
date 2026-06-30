import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminSignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // Handle admin authentication
    try {
      await axios.post("http://localhost:8000/api/admin/auth/signin", {
        email: formData.email,
        password: formData.password
      },{
        withCredentials: true
      })
      toast.success('Successfully signed in as admin');
      toast.success('This session is active for exactly 1 hour');

      navigate('/admin/problems');

    } catch (error) {
      toast.error("something went wrong");
      toast.message("Check your credentials");
    }
  };

  return (
    <div className="container mx-auto flex h-[80vh] max-w-md items-center">
      <Card className="w-full p-8">
        <div className="mb-8 text-center">
          <Shield className="mx-auto h-12 w-12" />
          <h1 className="mt-4 text-2xl font-semibold">Admin Access</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage problems
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}