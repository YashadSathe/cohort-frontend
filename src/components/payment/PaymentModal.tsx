import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, Wallet, Loader2, CheckCircle2, XCircle, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { coupons, Course } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

type PaymentMethod = 'full' | 'emi-3' | 'emi-6' | 'upi';

export function PaymentModal({ isOpen, onClose, course }: PaymentModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('full');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof coupons[0] | null>(null);
  const [couponError, setCouponError] = useState('');

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return Math.round((course.price * appliedCoupon.value) / 100);
    }
    return appliedCoupon.value;
  };

  const discount = calculateDiscount();
  const finalPrice = course.price - discount;

  const getEMIPrice = (months: number) => {
    const totalWithInterest = finalPrice * 1.05; // 5% interest
    return Math.round(totalWithInterest / months);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const foundCoupon = coupons.find(
      c => c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!foundCoupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    // Check if coupon is active
    if (foundCoupon.status !== 'active') {
      setCouponError('This coupon is no longer valid');
      return;
    }

    // Check expiry
    const now = new Date();
    const validUntil = new Date(foundCoupon.validUntil);
    if (now > validUntil) {
      setCouponError('This coupon has expired');
      return;
    }

    // Check usage limit
    if (foundCoupon.usedCount >= foundCoupon.usageLimit) {
      setCouponError('This coupon has reached its usage limit');
      return;
    }

    // Check applicable courses
    if (foundCoupon.applicableCourses !== 'all' && 
        !foundCoupon.applicableCourses.includes(course.id)) {
      setCouponError('This coupon is not applicable to this course');
      return;
    }

    setAppliedCoupon(foundCoupon);
    toast({
      title: 'Coupon Applied!',
      description: `You saved $${foundCoupon.type === 'percentage' 
        ? Math.round((course.price * foundCoupon.value) / 100) 
        : foundCoupon.value}`,
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      // Store course intent for after login
      localStorage.setItem('enrollmentIntent', JSON.stringify({
        courseId: course.id,
        courseSlug: course.slug,
        timestamp: Date.now(),
      }));
      onClose();
      navigate('/login');
      return;
    }

    setIsLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      toast({
        title: 'Payment Successful!',
        description: `You are now enrolled in ${course.title}`,
      });
      onClose();
      navigate('/student/dashboard');
    } else {
      toast({
        title: 'Payment Failed',
        description: 'Please try again or use a different payment method.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Enrollment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Summary */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-20 h-14 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-1">{course.title}</h3>
              <p className="text-sm text-muted-foreground">{course.duration}</p>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              className="space-y-2"
            >
              <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                paymentMethod === 'full' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="full" id="full" />
                  <label htmlFor="full" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-medium">Full Payment</span>
                  </label>
                </div>
                <span className="font-semibold">${finalPrice}</span>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                paymentMethod === 'emi-3' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="emi-3" id="emi-3" />
                  <label htmlFor="emi-3" className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="w-5 h-5 text-accent" />
                    <div>
                      <span className="font-medium">3 Monthly EMI</span>
                      <p className="text-xs text-muted-foreground">No-cost EMI available</p>
                    </div>
                  </label>
                </div>
                <span className="font-semibold">${getEMIPrice(3)}/mo</span>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                paymentMethod === 'emi-6' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="emi-6" id="emi-6" />
                  <label htmlFor="emi-6" className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="w-5 h-5 text-accent" />
                    <div>
                      <span className="font-medium">6 Monthly EMI</span>
                      <p className="text-xs text-muted-foreground">Low monthly payments</p>
                    </div>
                  </label>
                </div>
                <span className="font-semibold">${getEMIPrice(6)}/mo</span>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="upi" id="upi" />
                  <label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="w-5 h-5 text-success" />
                    <span className="font-medium">UPI Payment</span>
                  </label>
                </div>
                <span className="font-semibold">${finalPrice}</span>
              </div>
            </RadioGroup>
          </div>

          {/* Coupon Code */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Have a Coupon?</Label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="font-medium text-success">{appliedCoupon.code}</span>
                  <Badge variant="secondary" className="bg-success/20 text-success">
                    {appliedCoupon.type === 'percentage' 
                      ? `${appliedCoupon.value}% OFF` 
                      : `$${appliedCoupon.value} OFF`}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={removeCoupon}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="pl-9"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <p className="text-sm text-destructive">{couponError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Try: LAUNCH50 for 50% off
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Price Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Original Price</span>
              <span className="line-through text-muted-foreground">${course.originalPrice}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Course Price</span>
              <span>${course.price}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-success">
                <span>Coupon Discount</span>
                <span>-${discount}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${finalPrice}</span>
            </div>
          </div>

          {/* Pay Button */}
          <Button
            className="w-full h-12 gradient-primary border-0 text-lg"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Pay $${finalPrice}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By completing this purchase, you agree to our Terms of Service.
            <br />
            30-day money-back guarantee.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}