import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  CreditCard,
  Tag,
  CheckCircle2,
  Loader2,
  Shield,
} from 'lucide-react';
import { getCourseById, getCouponByCode } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Payment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const course = getCourseById(courseId || '');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ReturnType<typeof getCouponByCode>>(undefined);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </div>
    );
  }

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return Math.round((course.price * appliedCoupon.value) / 100);
    }
    return appliedCoupon.value;
  };

  const discount = calculateDiscount();
  const finalPrice = course.price - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const coupon = getCouponByCode(couponCode);

    if (!coupon) {
      toast({
        title: 'Invalid Coupon',
        description: 'The coupon code you entered is not valid.',
        variant: 'destructive',
      });
    } else if (coupon.status !== 'active') {
      toast({
        title: 'Coupon Expired',
        description: 'This coupon code has expired.',
        variant: 'destructive',
      });
    } else {
      setAppliedCoupon(coupon);
      toast({
        title: 'Coupon Applied!',
        description: `You saved $${calculateDiscount()} with code ${coupon.code}`,
      });
    }

    setIsApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(undefined);
    setCouponCode('');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: 'Payment Successful!',
      description: 'You have been enrolled in the course.',
    });

    setIsProcessing(false);
    navigate('/student/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <h1 className="text-2xl md:text-3xl font-bold">Complete Your Purchase</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Coupon Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Apply Coupon
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="font-medium">{appliedCoupon.code}</span>
                    <Badge variant="secondary">
                      {appliedCoupon.type === 'percentage' 
                        ? `${appliedCoupon.value}% off` 
                        : `$${appliedCoupon.value} off`}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                  >
                    {isApplyingCoupon ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Try: LAUNCH50 for 50% off
              </p>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span>Credit / Debit Card</span>
                      <div className="flex gap-2">
                        <div className="w-10 h-6 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">
                          VISA
                        </div>
                        <div className="w-10 h-6 bg-red-500 rounded text-xs text-white flex items-center justify-center font-bold">
                          MC
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex-1 cursor-pointer">
                    UPI / Net Banking
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" type="password" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name on Card</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-20 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2">{course.title}</p>
                  <p className="text-xs text-muted-foreground">{course.duration}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Price</span>
                  <span>${course.originalPrice}</span>
                </div>
                {course.originalPrice > course.price && (
                  <div className="flex justify-between text-success">
                    <span>Course Discount</span>
                    <span>-${course.originalPrice - course.price}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-success">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-${discount}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${finalPrice}</span>
              </div>

              <Button
                className="w-full gradient-primary border-0 h-12"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  `Pay $${finalPrice}`
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Secure 256-bit SSL encryption</span>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
