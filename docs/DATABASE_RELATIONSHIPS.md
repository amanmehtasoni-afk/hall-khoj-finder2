# Hall Khoj Finder — Database Relationships & Entity Relationship Diagram

```mermaid
erDiagram
    auth_users ||--|| profiles : "identifies (1:1)"
    profiles ||--o{ user_roles : "has roles (1:N)"
    profiles ||--o| owners : "operates business (1:1)"
    owners ||--o{ venues : "owns (1:N)"
    owners ||--o{ staff : "employs (1:N)"
    venues ||--o{ venue_images : "showcases (1:N)"
    venues ||--o{ venue_videos : "features (1:N)"
    venues ||--o{ venue_facilities : "provides (1:N)"
    venues ||--o{ venue_availability : "schedules (1:N)"
    venues ||--o{ bookings : "receives (1:N)"
    owners ||--o{ bookings : "approves (1:N)"
    profiles ||--o{ bookings : "reserves (1:N)"
    bookings ||--o{ booking_status_history : "tracks transitions (1:N)"
    bookings ||--o{ payments : "funded by (1:N)"
    payments ||--o{ transactions : "recorded in (1:N)"
    venues ||--o{ reviews : "rated by (1:N)"
    profiles ||--o{ reviews : "writes (1:N)"
    profiles ||--o{ favorites : "shortlists (1:N)"
    venues ||--o{ favorites : "saved as (1:N)"
    profiles ||--o{ notifications : "receives (1:N)"
    profiles ||--o{ conversations : "participates (1:N)"
    conversations ||--o{ messages : "contains (1:N)"
```

## Key Relational Invariants:
1. Every booking is tied to exactly one `venue_id` and one `owner_id`.
2. Double-booking is prevented by unique compound constraint on `venue_availability(venue_id, event_date, time_slot)` with transactional locking.
3. Every payment links to a valid booking, with payment status segregated from booking status.
