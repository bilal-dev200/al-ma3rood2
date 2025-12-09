# Services Module – Backend API Contract

This document summarises the backend endpoints the Services module depends on. Response samples mirror the structures the frontend already consumes. Aligning APIs with these shapes lets us replace the current mock data seamlessly.

---

## 1. Categories (flat list)

**Endpoint**  
`GET /category?category_type=services`

**Purpose**  
Returns the flat category list filtered to the `services` type. Used for global category pickers and any overview UIs that require just the top-level names.

---

## 2. Category tree (nested)

**Endpoint**  
`GET /category/tree?category_type=services`

**Purpose**  
Provides the nested hierarchy (categories → subcategories → …). The frontend flattens each branch into a “leaf” list so users can target specific service niches when listing or filtering.

**Response fragment**
```json
[
  {
    "id": 101,
    "name": "Home & Garden",
    "children": [
      {
        "id": 108,
        "name": "Cleaning Services",
        "children": [
          {
            "id": 305,
            "name": "Move-out cleans"
          }
        ]
      }
    ]
  }
]
```

---

## 3. Regions & governorates

**Endpoint**  
`POST /countries/list`

**Purpose**  
This existing endpoint returns Saudi Arabia with all regions → governorates → cities. We only need the first two levels.

**Response fragment**
```json
{
  "data": {
    "countries": [
      {
        "id": 1,
        "name": "Saudi Arabia",
        "regions": [
          {
            "id": 1,
            "name": "Al Bahah",
            "governorates": [
              {
                "id": 1,
                "name": "Adam",
                "cities": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```

The UI maps `region.id` → `region_id` and `governorate.id` → `governorate_id` when creating listings.

---

## 4. List services (browse/search)

**Endpoint**  
`GET /services`

**Query parameters**
- `query` – text search
- `category`, `subcategory` – category filters (IDs)
- `region`, `governorate` – location filters (IDs)
- `price_min`, `price_max` – price band
- `sort` – one of `featured`, `price-low-high`, `price-high-low`, `rating`
- `page`, `page_size` – pagination controls

**Response**
```json
{
  "data": [
    {
      "slug": "premium-home-cleaning-organisation",
      "title": "Premium Home Cleaning & Organisation",
      "subtitle": "Weekly and one-off deep cleans…",
      "description": "Full description used on detail page.",
      "category": "home-garden",
      "subcategory": "Cleaning Services",
      "region": "auckland",
      "region_label": "Auckland",
      "governorate": "North Shore",
      "price": 98,
      "price_unit": "per visit",
      "rating": 4.9,
      "reviews": 182,
      "response_time": "Usually responds in 1 hour",
      "next_availability": "Available this Friday",
      "is_verified": true,
      "badges": ["Top Rated", "Background Checked"],
      "experience": "8 years experience",
      "photo": {
        "url": "https://cdn.example.com/services/svc-101.jpg",
        "width": 640,
        "height": 480,
        "alt": "Professional cleaners tidying a modern living room"
      },
      "tags": ["Eco products", "Pet friendly", "Move-out cleans"],
      "created_at": "2025-01-20T08:15:00.000Z",
      "updated_at": "2025-01-21T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 134
  }
}
```

---

## 5. Service detail

**Endpoint**  
`GET /services/:serviceSlug`

**Purpose**  
Drives the detail page. The response mirrors the list payload but includes extra media/gallery if available.

```json
{
  "slug": "premium-home-cleaning-organisation",
  "title": "Premium Home Cleaning & Organisation",
  "subtitle": "Weekly and one-off deep cleans…",
  "description": "Full description with line breaks, bullet points, etc.",
  "category": "home-garden",
  "subcategory": "Cleaning Services",
  "region": "auckland",
  "region_label": "Auckland",
  "governorate_label": "North Shore",
  "price": 98,
  "price_unit": "per visit",
  "rating": 4.9,
  "reviews": 182,
  "response_time": "Usually responds in 1 hour",
  "next_availability": "Available this Friday",
  "is_verified": true,
  "badges": ["Top Rated", "Background Checked"],
  "experience": "8 years experience",
  "photo": { "...": "..." },
  "gallery": [
    {
      "url": "https://cdn.example.com/services/svc-101-1.jpg",
      "width": 960,
      "height": 720,
      "alt": "Kitchen after cleaning"
    }
  ],
  "tags": ["Eco products", "Pet friendly", "Move-out cleans"],
  "created_at": "2025-01-20T08:15:00.000Z",
  "updated_at": "2025-01-21T10:30:00.000Z"
}
```

---

## 6. Related services

**Endpoint**  
`GET /services/:serviceSlug/related`

Returns up to four similar providers (category match by default).

```json
{
  "data": [
    {
      "slug": "luxury-apartment-cleaning",
      "title": "Luxury Apartment Cleaning",
      "subtitle": "Specialised cleaning for apartments…",
      "category": "home-garden",
      "subcategory": "Cleaning Services",
      "region": "auckland",
      "region_label": "Auckland",
      "governorate_label": "CBD",
      "price": 140,
      "price_unit": "per visit",
      "rating": 4.8,
      "reviews": 76,
      "photo": { "...": "..." }
    }
  ]
}
```

---

## 7. Book a service

**Endpoint**  
`POST /services/:serviceSlug/book`

**Purpose**  
Creates a booking intent that locks the selected slot/price and exposes the booking in both buyer and provider dashboards. We expect the backend to validate availability, capture pricing metadata, and return a booking reference immediately.

**Payload (JSON)**
| Field | Type | Notes |
|-------|------|-------|
| `service_slug` | string | Redundant but keeps payload explicit |
| `buyer_note` | string | Free-form request message |
| `preferred_date` | string (ISO 8601) | Optional date/time |
| `preferred_time_window` | object | `{ "start": "09:00", "end": "12:00" }` optional |
| `address_id` | integer | Saved address reference; fallback to inline address fields |
| `address` | object | Optional inline `{ line1, line2, city, region_id, governorate_id }` |
| `budget` | number | Optional max budget |
| `attachments[]` | file | Optional supporting files (images/pdf) |

**Success (201)**
```json
{
  "message": "Service booked successfully.",
  "data": {
    "booking_id": "svc-book-28751",
    "status": "pending-provider-confirmation",
    "service": { "...": "..." },
    "buyer": { "id": 55, "name": "Hala Al Rashid" }
  }
}
```

Statuses emitted by the backend should include at minimum:  
`pending-provider-confirmation`, `provider-confirmed`, `buyer-confirmed`, `in-progress`, `completed`, `cancelled-by-provider`, `cancelled-by-buyer`.

---

## 8. Booking detail & timeline

**Endpoint**  
`GET /services/bookings/:bookingId`

**Purpose**  
Feeds the new **Account → Services** dashboard cards. Includes service snapshot, participants, scheduled slot, price agreement, and a chronological activity log the UI can render (similar to the marketplace order timeline).

**Response fragment**
```json
{
  "booking_id": "svc-book-28751",
  "service": { "...": "..." },
  "quote": {
    "price": 240,
    "price_unit": "per visit",
    "currency": "SAR",
    "payment_required": true
  },
  "schedule": {
    "date": "2025-03-04",
    "start_time": "09:00",
    "end_time": "12:00"
  },
  "status": "provider-confirmed",
  "activity": [
    {
      "type": "booking_created",
      "actor": "buyer",
      "message": "Hala requested the service.",
      "timestamp": "2025-02-20T08:15:00Z"
    },
    {
      "type": "provider_confirmed",
      "actor": "provider",
      "message": "Khalid accepted the booking.",
      "timestamp": "2025-02-20T10:02:00Z"
    }
  ]
}
```

---

## 9. Booking actions (buyer & provider)

### 9.1 Provider confirms or proposes changes
**Endpoint**  
`POST /services/bookings/:bookingId/provider-response`

**Payload**
```json
{
  "action": "confirm" | "decline" | "propose-new-slot",
  "note": "Optional message",
  "schedule": {
    "date": "2025-03-06",
    "start_time": "13:00",
    "end_time": "16:00"
  }
}
```

### 9.2 Buyer confirms quote / prepay
**Endpoint**  
`POST /services/bookings/:bookingId/buyer-confirmation`

**Payload**
```json
{
  "action": "confirm" | "cancel",
  "payment_method_id": 812,
  "note": "Optional message"
}
```

### 9.3 Both parties mark completion
**Endpoint**  
`POST /services/bookings/:bookingId/mark-complete`

**Payload**
```json
{
  "actor": "buyer" | "provider",
  "note": "Optional feedback",
  "attachments": []
}
```

When both actors submit `mark-complete`, the backend transitions the booking to `completed`. If only one actor submits, expose `buyer_marked_complete_at` / `provider_marked_complete_at` so we can show “Awaiting confirmation from Provider”.

### 9.4 Booking cancellation
Reuse the same endpoint with `action: "cancel"` or expose dedicated routes if the backend prefers clarity:
- `POST /services/bookings/:bookingId/cancel` (includes actor + reason)

---

## 10. Booking collections for dashboards

### 10.1 Buyer bookings list
**Endpoint**  
`GET /user/services/bookings`

**Query params**
- `status` – optional filter (comma-separated)
- `page`, `page_size`

### 10.2 Provider bookings list
**Endpoint**  
`GET /user/services/provider-bookings`

Both endpoints should return a paginated array with condensed booking cards:
```json
{
  "data": [
    {
      "booking_id": "svc-book-28751",
      "service": { "title": "...", "slug": "..." },
      "counterparty": { "id": 55, "name": "Hala Al Rashid", "avatar": "..." },
      "status": "pending-provider-confirmation",
      "schedule": { "date": "2025-03-04", "start_time": "09:00" },
      "last_activity": "2025-02-20T10:02:00Z"
    }
  ],
  "pagination": { "page": 1, "page_size": 20, "total": 5 }
}
```

---

## 11. Dashboard status summary

**Endpoint**  
`GET /user/services/summary`

**Purpose**  
Drives the counter pills on the Account → Services tabs so users can immediately see how many bookings require attention. The backend should calculate separate aggregates for buyer and provider views.

**Response**
```json
{
  "buyer": {
    "pending_provider_confirmation": 2,
    "pending_buyer_confirmation": 1,
    "in_progress": 3,
    "awaiting_completion": 1
  },
  "provider": {
    "new_requests": 4,
    "awaiting_buyer": 2,
    "in_progress": 5,
    "awaiting_completion": 1
  }
}
```

---

## 12. Booking messaging (optional but recommended)

**Endpoint**  
`POST /services/bookings/:bookingId/messages`

**Payload**
```json
{
  "message": "Happy to confirm the new slot.",
  "attachments": []
}
```

**Response**
```json
{
  "id": "msg-9283",
  "actor": "buyer",
  "message": "Happy to confirm the new slot.",
  "timestamp": "2025-02-20T11:45:00Z"
}
```

Messages should be retrievable via `GET /services/bookings/:bookingId/messages` to hydrate the in-thread chat UI we plan to introduce next.

---

## 13. Next steps for the backend team

1. **Persist booking lifecycle:** Implement the endpoints in sections 7–12 using the exact payloads so the current mock-backed UI can swap to live data without refactors.
2. **Notifications & webhooks:** Emit events (email/push/webhook) whenever booking statuses change, especially for `pending-provider-confirmation`, proposed slots, and completion confirmations.
3. **Attachment handling:** Support optional `attachments[]` for booking creation and completion notes, following the same multipart conventions as service creation.
4. **Access control:** Ensure that only the buyer, provider, or admins can fetch or mutate a booking. The UI assumes `403` responses to hide controls when access is denied.
5. **Auditing & timestamps:** Return ISO timestamps for every action (`confirmed_at`, `buyer_marked_complete_at`, etc.) so the dashboard timeline stays accurate.

## 7. Create service listing

**Endpoint**  
`POST /user/services/store`

**Payload (multipart/form-data)**
| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Required |
| `subtitle` | string | Required |
| `description` | string | Required |
| `category_id` | integer | Use the chosen subcategory ID; fallback to category ID if leaf |
| `region_id` | integer | Saudi region ID |
| `governorate_id` | integer | Governorate ID |
| `price` | numeric string | Starting price |
| `price_unit` | string | e.g. `per visit`, `per session` |
| `experience` | string (optional) | |
| `next_availability` | string (optional) | |
| `images[]` | file (optional, multiple) | JPG/PNG up to 5 MB each |

**Success (201)**
```json
{
  "message": "Service listing created successfully.",
  "data": {
    "slug": "premium-home-cleaning-organisation"
  }
}
```

Validation errors should follow the existing project convention (HTTP 422 with an `errors` object keyed by field name).

---

### Notes & conventions

- All timestamps should be ISO 8601 strings (`created_at`, `updated_at`, etc.).
- Provide both IDs and human-readable labels for regions/governorates (`region_label`, `governorate_label`) to avoid redundant client lookups.
- When optional data is absent, either omit the field or return `null` (avoid empty strings).
- Arrays such as `tags`, `badges`, `gallery` can be empty but should always be present for consistency.

Keeping the API aligned with these contracts ensures the Services module can move from mock data to live responses without additional frontend refactors.

