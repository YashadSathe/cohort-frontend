import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Ticket,
  Plus,
  Percent,
  IndianRupee,
  Calendar,
  Edit,
  Trash2,
  Copy,
  Loader2,
} from 'lucide-react';
import { getAllCoupons, createCoupon, deleteCoupon, toggleCouponStatus } from '@/services/api';
import type { Coupon } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function AdminCoupons() {
  const { toast } = useToast();
  const [couponList, setCouponList] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'flat',
    value: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    status: 'active' as 'active' | 'expired' | 'disabled',
  });

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const coupons = await getAllCoupons();
        setCouponList(coupons);
      } catch (error) {
        console.error('Failed to load coupons:', error);
        toast({
          title: 'Error',
          description: 'Failed to load coupons',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadCoupons();
  }, [toast]);

  const handleCreateCoupon = async () => {
    if (!newCoupon.code || !newCoupon.value) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createCoupon({
        code: newCoupon.code.toUpperCase(),
        type: newCoupon.type,
        value: parseInt(newCoupon.value),
        usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : 999,
        validFrom: newCoupon.validFrom,
        validUntil: newCoupon.validUntil,
        status: newCoupon.status,
        applicableCourses: 'all',
      });

      setCouponList([created, ...couponList]);
      setIsCreateOpen(false);
      setNewCoupon({
        code: '',
        type: 'percentage',
        value: '',
        usageLimit: '',
        validFrom: '',
        validUntil: '',
        status: 'active',
      });

      toast({
        title: 'Coupon created',
        description: `Coupon ${created.code} has been created`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create coupon',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const handleToggleCoupon = async (couponId: string) => {
    try {
      const updated = await toggleCouponStatus(couponId);
      setCouponList(couponList.map((c) => (c.id === couponId ? updated : c)));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle coupon status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      await deleteCoupon(couponId);
      setCouponList(couponList.filter((c) => c.id !== couponId));
      toast({
        title: 'Coupon deleted',
        description: 'The coupon has been removed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete coupon',
        variant: 'destructive',
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: `Coupon code ${code} copied to clipboard`,
    });
  };

  const activeCount = couponList.filter((c) => c.status === 'active').length;
  const totalUses = couponList.reduce((acc, c) => acc + c.usedCount, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Coupon Management</h1>
          <p className="text-muted-foreground">Create and manage discount coupons</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Coupon Code</Label>
                <Input
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                  }
                  placeholder="SUMMER2024"
                  className="uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select
                    value={newCoupon.type}
                    onValueChange={(value: 'percentage' | 'flat') =>
                      setNewCoupon({ ...newCoupon, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="flat">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Discount Value {newCoupon.type === 'percentage' ? '(%)' : '(₹)'}
                  </Label>
                  <Input
                    type="number"
                    value={newCoupon.value}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, value: e.target.value })
                    }
                    placeholder={newCoupon.type === 'percentage' ? '20' : '500'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Usage Limit (leave empty for unlimited)</Label>
                <Input
                  type="number"
                  value={newCoupon.usageLimit}
                  onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                  placeholder="100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    value={newCoupon.validFrom}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, validFrom: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={newCoupon.validUntil}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, validUntil: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Active</p>
                  <p className="text-sm text-muted-foreground">
                    Coupon can be used immediately
                  </p>
                </div>
                <Switch
                  checked={newCoupon.status === 'active'}
                  onCheckedChange={(checked) =>
                    setNewCoupon({ ...newCoupon, status: checked ? 'active' : 'disabled' })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCoupon} className="gradient-primary border-0" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Create Coupon
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{couponList.length}</p>
              <p className="text-sm text-muted-foreground">Total Coupons</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <Percent className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active Coupons</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalUses}</p>
              <p className="text-sm text-muted-foreground">Total Uses</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Code
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Discount
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Uses
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Valid Period
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {couponList.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                          {coupon.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyCode(coupon.code)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {coupon.type === 'percentage' ? (
                          <>
                            <Percent className="w-4 h-4 text-primary" />
                            <span>{coupon.value}% off</span>
                          </>
                        ) : (
                          <>
                            <IndianRupee className="w-4 h-4 text-primary" />
                            <span>{coupon.value} off</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                      {coupon.validFrom} - {coupon.validUntil}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Switch
                        checked={coupon.status === 'active'}
                        onCheckedChange={() => handleToggleCoupon(coupon.id)}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
