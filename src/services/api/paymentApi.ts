import { simulateNetworkDelay, USE_MOCK_API, API_BASE_URL } from './config';
import { coupons, Coupon, Course } from '@/data/mockData';
import type { CouponValidationResult, PaymentPayload, PaymentResult } from './types';

// Local mutable copy for mock operations
let mockCoupons = [...coupons];

/**
 * Validate and apply a coupon code
 * 
 * Suggested endpoint: POST /api/payments/validate-coupon
 * Request body: { courseId: string, code: string }
 * Response: CouponValidationResult
 */
export async function validateCoupon(courseId: string, code: string, coursePrice: number): Promise<CouponValidationResult> {
  if (USE_MOCK_API) {
    // TODO: Replace this mock implementation with a real fetch call:
    // const res = await fetch(`${API_BASE_URL}/api/payments/validate-coupon`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ courseId, code }),
    // });
    // return res.json();

    await simulateNetworkDelay();

    const foundCoupon = mockCoupons.find(
      c => c.code.toLowerCase() === code.toLowerCase()
    );

    if (!foundCoupon) {
      return { valid: false, discountedPrice: coursePrice, discountAmount: 0, error: 'Invalid coupon code' };
    }

    // Check if coupon is active
    if (foundCoupon.status !== 'active') {
      return { valid: false, discountedPrice: coursePrice, discountAmount: 0, error: 'This coupon is no longer valid' };
    }

    // Check expiry
    const now = new Date();
    const validUntil = new Date(foundCoupon.validUntil);
    if (now > validUntil) {
      return { valid: false, discountedPrice: coursePrice, discountAmount: 0, error: 'This coupon has expired' };
    }

    // Check usage limit
    if (foundCoupon.usedCount >= foundCoupon.usageLimit) {
      return { valid: false, discountedPrice: coursePrice, discountAmount: 0, error: 'This coupon has reached its usage limit' };
    }

    // Check applicable courses
    if (foundCoupon.applicableCourses !== 'all' && !foundCoupon.applicableCourses.includes(courseId)) {
      return { valid: false, discountedPrice: coursePrice, discountAmount: 0, error: 'This coupon is not applicable to this course' };
    }

    // Calculate discount
    let discountAmount = 0;
    if (foundCoupon.type === 'percentage') {
      discountAmount = Math.round((coursePrice * foundCoupon.value) / 100);
    } else {
      discountAmount = foundCoupon.value;
    }

    const discountedPrice = coursePrice - discountAmount;

    return {
      valid: true,
      discountedPrice,
      discountAmount,
      coupon: foundCoupon,
    };
  } else {
    const res = await fetch(`${API_BASE_URL}/api/payments/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, code, coursePrice }),
    });
    if (!res.ok) throw new Error('Failed to validate coupon');
    return res.json();
  }
}

/**
 * Process a payment
 * 
 * Suggested endpoint: POST /api/payments/process
 * Request body: PaymentPayload
 * Response: PaymentResult
 */
export async function processPayment(payload: PaymentPayload): Promise<PaymentResult> {
  if (USE_MOCK_API) {
    // TODO: Replace this mock implementation with a real fetch call:
    // const res = await fetch(`${API_BASE_URL}/api/payments/process`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
    // return res.json();

    await simulateNetworkDelay(2000); // Longer delay to simulate payment processing

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      // If coupon was used, increment usage count
      if (payload.couponCode) {
        const couponIndex = mockCoupons.findIndex(
          c => c.code.toLowerCase() === payload.couponCode?.toLowerCase()
        );
        if (couponIndex !== -1) {
          mockCoupons[couponIndex].usedCount += 1;
        }
      }

      return {
        success: true,
        transactionId: `TXN-${Date.now()}`,
      };
    } else {
      return {
        success: false,
        error: 'Payment processing failed. Please try again.',
      };
    }
  } else {
    const res = await fetch(`${API_BASE_URL}/api/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Payment failed' };
    }
    return res.json();
  }
}

/**
 * Get all coupons (admin)
 * 
 * Suggested endpoint: GET /api/coupons
 * Response: Coupon[]
 */
export async function getAllCoupons(): Promise<Coupon[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return [...mockCoupons];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/coupons`);
    if (!res.ok) throw new Error('Failed to fetch coupons');
    return res.json();
  }
}

/**
 * Create a new coupon
 * 
 * Suggested endpoint: POST /api/coupons
 * Request body: Partial<Coupon>
 * Response: Coupon
 */
export async function createCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const newCoupon: Coupon = {
      id: `coupon-${Date.now()}`,
      code: couponData.code || `CODE${Date.now()}`,
      type: couponData.type || 'percentage',
      value: couponData.value || 10,
      validFrom: couponData.validFrom || new Date().toISOString().split('T')[0],
      validUntil: couponData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: couponData.usageLimit || 100,
      usedCount: 0,
      status: couponData.status || 'active',
      applicableCourses: couponData.applicableCourses || 'all',
    };

    mockCoupons.push(newCoupon);
    return newCoupon;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData),
    });
    if (!res.ok) throw new Error('Failed to create coupon');
    return res.json();
  }
}

/**
 * Update a coupon
 * 
 * Suggested endpoint: PUT /api/coupons/:id
 * Request body: Partial<Coupon>
 * Response: Coupon
 */
export async function updateCoupon(couponId: string, data: Partial<Coupon>): Promise<Coupon> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockCoupons.findIndex(c => c.id === couponId);
    if (index === -1) throw new Error('Coupon not found');

    mockCoupons[index] = { ...mockCoupons[index], ...data };
    return mockCoupons[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/coupons/${couponId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update coupon');
    return res.json();
  }
}

/**
 * Delete a coupon
 * 
 * Suggested endpoint: DELETE /api/coupons/:id
 * Response: { success: boolean }
 */
export async function deleteCoupon(couponId: string): Promise<void> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    mockCoupons = mockCoupons.filter(c => c.id !== couponId);
  } else {
    const res = await fetch(`${API_BASE_URL}/api/coupons/${couponId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete coupon');
  }
}

/**
 * Toggle coupon status (enable/disable)
 * 
 * Suggested endpoint: PUT /api/coupons/:id/toggle
 * Response: Coupon
 */
export async function toggleCouponStatus(couponId: string): Promise<Coupon> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockCoupons.findIndex(c => c.id === couponId);
    if (index === -1) throw new Error('Coupon not found');

    const currentStatus = mockCoupons[index].status;
    mockCoupons[index].status = currentStatus === 'active' ? 'disabled' : 'active';
    return mockCoupons[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/coupons/${couponId}/toggle`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to toggle coupon status');
    return res.json();
  }
}
