# Hall Khoj Finder — Environment Variables Reference (Phase 20)

| Variable | Scope | Description | Sample / Default |
|---|---|---|---|
| `PORT` | Server | Express HTTP server port | `3000` |
| `NODE_ENV` | Server | Node runtime mode (`development` or `production`) | `production` |
| `FRONTEND_URL` | Server | Base URL of frontend for CORS | `https://hallkhoj.in` |
| `BACKEND_URL` | Server | Base API URL | `https://api.hallkhoj.in` |
| `SUPABASE_URL` | Client & Server | Supabase Cloud project URL | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Client & Server | Supabase public anonymous API key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Privileged server-side key (NEVER expose to browser) | `eyJhbGciOi...` |
| `AUTH_SECRET` | Server Only | Random 64-char string for JWT token signing | Random 64-char hex |
| `RAZORPAY_KEY_ID` | Client & Server | Razorpay Merchant Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Server Only | Razorpay secret for HMAC verification | Private key |
| `AI_API_KEY` | Server Only | Google Gemini API key for natural language search | Gemini API Key |
| `MONGODB_URI` | Server Only | MongoDB Atlas fallback connection string | `mongodb+srv://...` |
