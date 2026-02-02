# Frontend-Backend Integration Analysis

## 🔍 **Backend Implementation Status**

### ✅ **What's Implemented in Backend**

#### 1. **Payment Verification** ✅
- **Endpoint:** `POST /api/payment/verify`
- **Location:** `app/controllers/payment-ctlr.js`
- **Features:**
  - Verifies payment signature
  - Fetches payment details from Razorpay API
  - Verifies payment status
  - Checks for duplicate bookings
  - Returns verification result

#### 2. **Webhook Handler** ✅
- **Endpoint:** `POST /api/payment/webhook`
- **Location:** `app/controllers/payment-ctlr.js`
- **Features:**
  - Webhook signature verification
  - Handles: `payment.captured`, `payment.failed`, `payment.authorized`, `order.paid`, `refund.created`
  - Updates booking status automatically

#### 3. **Secure Booking Creation** ✅
- **Endpoint:** `POST /api/bookings`
- **Location:** `app/controllers/booking-cltr.js`
- **Security:**
  - ✅ Verifies payment before creating booking
  - ✅ Prevents duplicate bookings
  - ✅ Validates payment amount
  - ✅ Uses authenticated user ID (from Cognito)
  - ✅ Sets payment status based on Razorpay response

#### 4. **Booking Model** ✅
- **Location:** `app/models/booking-model.js`
- **Fields:**
  - `paymentStatus`: `["created", "authorized", "paid", "failed", "refunded"]`
  - `paymentDate`, `failureReason`, `refundAmount`, `refundDate`, `refundId`
  - `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`

#### 5. **Payment Utilities** ✅
- **Location:** `utils/paymentVerification.js`
- **Functions:**
  - `verifyPayment()` - Comprehensive verification
  - `verifyPaymentSignature()` - Signature verification
  - `verifyWebhookSignature()` - Webhook verification
  - `fetchPaymentDetails()` - Fetch from Razorpay API
  - `fetchOrderDetails()` - Fetch order details

---

## ❌ **What's Missing in Frontend**

### **Current Frontend Flow (Incorrect):**
```typescript
// ❌ Current: Direct booking creation without verification
handler: async function (response: any) {
  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
    eventId: event._id,
    userId: "TEMP_USER_ID", // ❌ Hardcoded
    tickets: ticketCount,
    totalAmount,
    razorpayOrderId: order.id,
    razorpayPaymentId: response.razorpay_payment_id,
    razorpaySignature: response.razorpay_signature,
  });
}
```

### **Issues:**
1. ❌ **No payment verification** - Booking created without verifying payment
2. ❌ **Hardcoded user ID** - Using `"TEMP_USER_ID"` instead of actual user
3. ❌ **No error handling** - Payment failures not handled
4. ❌ **No payment cancellation** - User closing window not handled
5. ❌ **Hardcoded user data** - Prefill uses test data

---

## ✅ **Required Frontend Changes**

### **1. Update Payment Handler** 🔴 **URGENT**

**Current:** `src/app/events/[id]/page.tsx`

**Required Changes:**
```typescript
// ✅ NEW: Verify payment first, then create booking
handler: async function (response: any) {
  try {
    setLoading(true);
    
    // Step 1: Verify payment with backend
    const verifyRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,
      {
        orderId: order.id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
      }
    );

    if (!verifyRes.data.success) {
      alert("❌ Payment verification failed: " + verifyRes.data.message);
      return;
    }

    // Step 2: Create booking (backend will verify again)
    const bookingRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
      {
        eventId: event._id,
        tickets: ticketCount,
        totalAmount,
        razorpayOrderId: order.id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (bookingRes.data.success) {
      alert("✅ Booking confirmed!");
      // Redirect or update UI
    }
  } catch (err: any) {
    console.error("❌ Booking failed:", err);
    alert(err.response?.data?.message || "Booking failed. Please contact support.");
  } finally {
    setLoading(false);
  }
}
```

---

### **2. Get Real User Data** 🟡 **HIGH PRIORITY**

**Current:**
```typescript
// ❌ Hardcoded
prefill: {
  name: "Test User",
  email: "test@example.com",
  contact: "9999999999",
}
```

**Required:**
```typescript
// ✅ Get from authentication
const user = getUserFromAuth(); // Get from Redux/Cognito
prefill: {
  name: user?.name || "",
  email: user?.email || "",
  contact: user?.phone || "",
}
```

**Note:** Backend extracts `userId` from `req.user` (Cognito auth), so frontend doesn't need to send `userId` in request body.

---

### **3. Add Payment Cancellation Handler** 🟡 **HIGH PRIORITY**

**Required:**
```typescript
const options = {
  // ... existing options
  modal: {
    ondismiss: function() {
      // User closed payment window
      setLoading(false);
      alert("Payment cancelled");
    }
  },
  handler: async function (response: any) {
    // ... payment success handler
  }
};
```

---

### **4. Add Payment Failure Handler** 🟡 **HIGH PRIORITY**

**Required:**
```typescript
const options = {
  // ... existing options
  handler: async function (response: any) {
    // Success handler
  },
  // Add failure handler
  prefill: {
    // ... user data
  },
  // Add error handler
  notes: {
    // Optional notes
  }
};

// Handle payment errors
rzp.on('payment.failed', function (response: any) {
  console.error('Payment failed:', response.error);
  alert('Payment failed: ' + response.error.description);
  setLoading(false);
});
```

---

### **5. Update API Route Format** 🟢 **MEDIUM PRIORITY**

**Current:** `src/app/api/payment/createOrder.ts` uses old format

**Should be:** `src/app/api/payment/createOrder/route.ts` (App Router)

**Note:** Since backend handles order creation, frontend API route may not be needed. Check if it's being used.

---

## 📋 **Integration Checklist**

### **Frontend Updates Required:**

- [ ] **Update payment handler** to verify payment first
- [ ] **Remove hardcoded user ID** - Backend extracts from auth
- [ ] **Get real user data** for Razorpay prefill
- [ ] **Add payment cancellation handler**
- [ ] **Add payment failure handler**
- [ ] **Add proper error handling**
- [ ] **Add loading states**
- [ ] **Add success confirmation UI**
- [ ] **Update API calls** to include auth headers
- [ ] **Test complete payment flow**

---

## 🔄 **Correct Payment Flow**

### **Step-by-Step:**

1. **User clicks "Book Tickets"**
   - Frontend validates ticket count
   - Shows loading state

2. **Create Order** ✅
   - `POST /api/payment/create-order`
   - Backend creates Razorpay order
   - Returns order ID and key

3. **Open Razorpay Checkout** ✅
   - Frontend opens Razorpay modal
   - Prefills user data (from auth)
   - User completes payment

4. **Payment Success Handler** ⚠️ **NEEDS UPDATE**
   - **NEW:** Verify payment first
     - `POST /api/payment/verify`
     - Backend verifies signature and payment status
   - **THEN:** Create booking
     - `POST /api/bookings` (with auth header)
     - Backend verifies payment again
     - Creates booking with verified data

5. **Webhook (Async)** ✅
   - Razorpay sends webhook
   - Backend updates booking status
   - No frontend action needed

---

## 🔒 **Security Improvements**

### **Backend Already Has:**
- ✅ Payment signature verification
- ✅ Webhook signature verification
- ✅ Server-side payment verification
- ✅ Duplicate booking prevention
- ✅ Amount validation
- ✅ User ID from authentication

### **Frontend Needs:**
- ✅ Call verification endpoint before booking
- ✅ Include auth token in booking request
- ✅ Handle payment failures gracefully
- ✅ Don't trust client-side payment data

---

## 📝 **API Endpoints Summary**

### **Backend Endpoints:**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/payment/create-order` | POST | ❌ | Create Razorpay order |
| `/api/payment/verify` | POST | ❌ | Verify payment signature |
| `/api/payment/webhook` | POST | ❌ | Razorpay webhook handler |
| `/api/bookings` | POST | ✅ | Create booking (with verification) |
| `/api/bookings` | GET | ✅ | List user bookings |

### **Frontend Should Use:**

1. **Order Creation:** ✅ Already using
   ```typescript
   POST /api/payment/create-order
   ```

2. **Payment Verification:** ❌ **MISSING**
   ```typescript
   POST /api/payment/verify
   ```

3. **Booking Creation:** ⚠️ **NEEDS UPDATE**
   ```typescript
   POST /api/bookings
   // Add: Authorization header
   // Remove: userId from body (backend extracts from auth)
   ```

---

## 🎯 **Action Items**

### **Immediate (Security):**
1. ✅ Update payment handler to verify payment first
2. ✅ Add auth header to booking request
3. ✅ Remove hardcoded user ID

### **High Priority:**
4. ✅ Get real user data for prefill
5. ✅ Add payment cancellation handler
6. ✅ Add payment failure handler
7. ✅ Improve error handling

### **Medium Priority:**
8. ✅ Add loading states
9. ✅ Add success confirmation
10. ✅ Test complete flow

---

## 📊 **Current vs Required State**

| Component | Current | Required |
|-----------|---------|----------|
| Payment Verification | ❌ Missing | ✅ Call `/api/payment/verify` |
| Booking Creation | ⚠️ No auth | ✅ Include auth header |
| User ID | ❌ Hardcoded | ✅ Backend extracts from auth |
| User Data | ❌ Hardcoded | ✅ Get from auth |
| Error Handling | ⚠️ Basic | ✅ Comprehensive |
| Payment Cancellation | ❌ Missing | ✅ Add handler |
| Payment Failure | ❌ Missing | ✅ Add handler |

---

## ✅ **Summary**

**Backend Status:** ✅ **PRODUCTION READY**
- All security features implemented
- Payment verification working
- Webhook handler ready

**Frontend Status:** ⚠️ **NEEDS UPDATES**
- Payment verification not called
- Auth headers missing
- User data hardcoded
- Error handling incomplete

**Next Steps:**
1. Update frontend payment handler
2. Add payment verification call
3. Fix user data and auth
4. Test complete flow

