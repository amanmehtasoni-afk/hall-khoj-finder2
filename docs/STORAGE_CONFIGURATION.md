# Hall Khoj Finder — Storage Configuration & Bucket Security

## 1. Buckets Overview
| Bucket Name | Access Level | File Size Limit | Allowed MIME Types | Folder Isolation |
|---|---|---|---|---|
| `venue-images` | Public Read | 10 MB | JPEG, PNG, WebP, AVIF | `{owner_id}/*` |
| `venue-videos` | Public Read | 100 MB | MP4, WebM, QuickTime | `{owner_id}/*` |
| `venue-documents` | Private | 15 MB | PDF, JPEG, PNG | `{owner_id}/*` |
| `profile-avatars` | Public Read | 5 MB | JPEG, PNG, WebP | `{user_id}/*` |
| `booking-documents` | Private | 15 MB | PDF, JPEG, PNG | `{booking_id}/*` |
| `payment-invoices` | Private | 10 MB | PDF | `{user_id}/*` |

## 2. Security Enforcement
1. **Owner Media Isolation**: Upload paths require the prefix to match the authenticated user's ID (`(storage.foldername(name))[1] = auth.uid()::text`). Owners cannot overwrite or delete files uploaded by other owners.
2. **Private Invoices**: Invoices are accessible only by the customer who paid, the venue owner, and superadmins.
