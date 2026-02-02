# Analytics & Reporting Dashboard - Requirements Analysis

## 📊 Overview
This document outlines all the data inputs required for the Analytics Dashboard and checks what's currently available in your codebase.

---

## ✅ **CURRENTLY AVAILABLE DATA & APIs**

### 1. **Events Data** ✅
**API Endpoints:**
- `GET /events` - Get all events
- `GET /events/:id` - Get single event
- `GET /events?isApproved=true` - Get approved events

**Available Fields:**
```typescript
{
  _id: string
  eventName: string
  eventDescription: string
  eventType: string
  location: string
  latitude: number
  longitude: number
  date: Date
  startTime: string
  endTime: string
  totalTickets: number
  ticketPrice: number
  isApproved: boolean | null
  suggestion?: string
  parkingAvailable: boolean
  foodAvailable: boolean
  contactEmail: string
  contactPhone: string
  photos: string[]
  createdAt: Date  // ✅ Available
}
```

**What We Can Calculate:**
- ✅ Total events count
- ✅ Approved/Pending/Disapproved events
- ✅ Events by type
- ✅ Events by location
- ✅ Events by date range
- ✅ Average ticket price
- ✅ Total tickets available

---

### 2. **Users Data** ✅
**API Endpoints:**
- `GET /users` - Get all users
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

**Available Fields:**
```typescript
{
  _id: string
  name: string
  email: string
  role: "admin" | "customer"
  image?: string
  createdAt: Date  // ✅ Available
}
```

**What We Can Calculate:**
- ✅ Total users count
- ✅ Admin vs Customer count
- ✅ New registrations by date
- ✅ User growth trends (if createdAt is available)

---

### 3. **Bookings Data** ⚠️ **PARTIALLY AVAILABLE**
**API Endpoints:**
- `POST /bookings` - Create booking ✅
- `GET /bookings` - **❌ NOT FOUND** (Need to check backend)
- `GET /bookings/:id` - **❌ NOT FOUND**

**Available Fields (from booking creation):**
```typescript
{
  eventId: string
  userId: string
  tickets: number
  totalAmount: number
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
  // ❌ Missing: createdAt, status, refundStatus, attendanceStatus
}
```

**What We CANNOT Calculate Yet:**
- ❌ Total bookings count
- ❌ Revenue analytics
- ❌ Booking trends
- ❌ Cancellation rates
- ❌ Attendance rates
- ❌ Booking status breakdown

---

### 4. **Payment Data** ⚠️ **LIMITED**
**API Endpoints:**
- `POST /payment/create-order` - Create Razorpay order ✅

**Available:**
- ✅ Razorpay integration exists
- ✅ Payment IDs stored in bookings

**Missing:**
- ❌ Payment status tracking
- ❌ Failed payment records
- ❌ Refund data
- ❌ Payment method breakdown
- ❌ Payment history endpoint

---

### 5. **Reviews/Ratings Data** ❌ **NOT IMPLEMENTED**
**Current Status:**
- ReviewPopover component exists (UI only)
- No API endpoint for reviews
- Reviews not saved to backend

**Missing:**
- ❌ `GET /reviews` - Get all reviews
- ❌ `POST /reviews` - Create review
- ❌ `GET /reviews/event/:eventId` - Get reviews for event
- ❌ Review data structure

---

## 📋 **REQUIRED DATA FOR ANALYTICS DASHBOARD**

### **1. Revenue Analytics** 💰
**Required Data:**
```typescript
{
  totalRevenue: number           // Sum of all successful payments
  revenueByPeriod: {             // Daily/Weekly/Monthly
    date: string
    revenue: number
  }[]
  revenueByEvent: {              // Per event revenue
    eventId: string
    eventName: string
    revenue: number
    bookings: number
  }[]
  paymentMethodBreakdown: {      // Payment methods used
    method: string
    count: number
    amount: number
  }[]
  refunds: {                     // Refund tracking
    totalRefunded: number
    refundCount: number
    refundsByEvent: {}
  }
}
```

**Backend APIs Needed:**
- `GET /analytics/revenue` - Get revenue analytics
- `GET /analytics/revenue?period=daily|weekly|monthly` - Revenue by period
- `GET /analytics/revenue/by-event` - Revenue by event
- `GET /bookings?status=completed` - Completed bookings with payment status

---

### **2. User Analytics** 👥
**Required Data:**
```typescript
{
  totalUsers: number
  newRegistrations: {            // New users by date
    date: string
    count: number
  }[]
  activeUsers: {                 // Users who booked events
    period: string
    count: number
  }[]
  userGrowth: {                  // Growth percentage
    period: string
    growth: number
  }[]
  usersByRole: {                 // Admin vs Customer
    role: string
    count: number
  }
}
```

**Backend APIs Needed:**
- `GET /analytics/users` - User analytics
- `GET /analytics/users/growth` - User growth trends
- `GET /analytics/users/active` - Active users

**Current Status:** ✅ Partially available (can calculate from `/users` endpoint)

---

### **3. Event Analytics** 🎪
**Required Data:**
```typescript
{
  totalEvents: number
  eventsByStatus: {              // Approved/Pending/Disapproved
    status: string
    count: number
  }
  popularEvents: {               // Most booked events
    eventId: string
    eventName: string
    bookings: number
    revenue: number
  }[]
  eventsByType: {                // Events by category
    type: string
    count: number
  }[]
  eventsByLocation: {             // Events by city/location
    location: string
    count: number
  }[]
  attendanceRates: {             // Actual vs Expected attendance
    eventId: string
    eventName: string
    expected: number
    actual: number
    rate: number
  }[]
}
```

**Backend APIs Needed:**
- `GET /analytics/events` - Event analytics
- `GET /analytics/events/popular` - Popular events
- `GET /analytics/events/attendance` - Attendance rates

**Current Status:** ✅ Partially available (can calculate from `/events` endpoint, but need booking data for popularity)

---

### **4. Booking Analytics** 🎫
**Required Data:**
```typescript
{
  totalBookings: number
  bookingsByStatus: {             // Completed/Cancelled/Pending
    status: string
    count: number
  }
  bookingTrends: {               // Bookings over time
    date: string
    count: number
  }[]
  cancellationRate: number       // Percentage of cancelled bookings
  peakBookingTimes: {            // When users book most
    hour: number
    count: number
  }[]
  averageTicketsPerBooking: number
  bookingConversionRate: number  // Views to bookings ratio
}
```

**Backend APIs Needed:**
- `GET /bookings` - Get all bookings ✅ **NEED TO VERIFY**
- `GET /bookings?status=:status` - Filter by status
- `GET /analytics/bookings` - Booking analytics
- `GET /analytics/bookings/trends` - Booking trends

**Current Status:** ❌ **NOT AVAILABLE** - Need to check if `/bookings` GET endpoint exists

---

### **5. Review Analytics** ⭐
**Required Data:**
```typescript
{
  totalReviews: number
  averageRating: number
  ratingDistribution: {          // 1-5 star distribution
    rating: number
    count: number
  }[]
  reviewsByEvent: {              // Reviews per event
    eventId: string
    eventName: string
    averageRating: number
    reviewCount: number
  }[]
  reviewTrends: {                // Reviews over time
    date: string
    count: number
  }[]
}
```

**Backend APIs Needed:**
- `GET /reviews` - Get all reviews
- `GET /reviews/analytics` - Review analytics
- `GET /reviews/event/:eventId` - Reviews for specific event

**Current Status:** ❌ **NOT IMPLEMENTED**

---

## 🔍 **WHAT NEEDS TO BE CREATED/VERIFIED**

### **High Priority (Required for Basic Analytics):**

1. **Bookings API** ⚠️
   - [ ] Verify `GET /bookings` endpoint exists
   - [ ] If not, create endpoint to fetch all bookings
   - [ ] Ensure bookings have: `createdAt`, `status`, `paymentStatus`

2. **Payment Status Tracking** ⚠️
   - [ ] Add payment status to booking model (completed/failed/pending/refunded)
   - [ ] Track failed payments
   - [ ] Store payment timestamps

3. **Analytics Endpoints** ❌
   - [ ] `GET /analytics/overview` - Overall dashboard stats
   - [ ] `GET /analytics/revenue` - Revenue analytics
   - [ ] `GET /analytics/users` - User analytics
   - [ ] `GET /analytics/events` - Event analytics
   - [ ] `GET /analytics/bookings` - Booking analytics

### **Medium Priority (Enhanced Analytics):**

4. **Reviews System** ❌
   - [ ] Create reviews API endpoints
   - [ ] Store review data in database
   - [ ] Link reviews to events and users

5. **Attendance Tracking** ❌
   - [ ] Add attendance marking system
   - [ ] Track actual vs expected attendance

6. **Refund Management** ❌
   - [ ] Track refunds
   - [ ] Store refund reasons and amounts

---

## 📊 **RECOMMENDED IMPLEMENTATION PHASES**

### **Phase 1: Basic Analytics (Can Start Now)**
✅ **Available:**
- Total events count
- Events by status (Approved/Pending/Disapproved)
- Events by type
- Total users count
- Users by role
- New user registrations (if createdAt available)

**Action:** Create basic dashboard with available data

---

### **Phase 2: Booking & Revenue Analytics (Need Backend Work)**
⚠️ **Requires:**
- `GET /bookings` endpoint
- Payment status in bookings
- Booking timestamps

**Action:** 
1. Verify/implement bookings API
2. Add payment status tracking
3. Create revenue analytics

---

### **Phase 3: Advanced Analytics (Future)**
❌ **Requires:**
- Reviews system
- Attendance tracking
- Refund management

**Action:** Implement missing features

---

## 🎯 **NEXT STEPS**

1. **Verify Backend APIs:**
   - Check if `GET /bookings` exists
   - Check booking data structure
   - Verify payment status tracking

2. **Start with Phase 1:**
   - Build basic analytics dashboard with available data
   - Show events and users statistics

3. **Request Backend Support:**
   - Ask backend team to add missing endpoints
   - Or implement them if you have backend access

---

## 📝 **SUMMARY**

| Feature | Status | Action Required |
|---------|--------|-----------------|
| Events Data | ✅ Available | Use existing `/events` API |
| Users Data | ✅ Available | Use existing `/users` API |
| Bookings Data | ⚠️ Partial | Verify `GET /bookings` endpoint |
| Payment Data | ⚠️ Limited | Add payment status tracking |
| Reviews Data | ❌ Missing | Implement reviews system |
| Analytics APIs | ❌ Missing | Create analytics endpoints |

**Recommendation:** Start with Phase 1 (Basic Analytics) using available data, then expand as backend APIs are added.

