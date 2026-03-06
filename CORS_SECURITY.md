# CORS Security Configuration Guide

## Overview

The Shield360 platform frontend communicates with multiple backend microservices via REST APIs. Each backend **must** implement strict CORS policies to prevent unauthorized cross-origin access.

## ⚠️ Important: Never Use Wildcard CORS

**Do NOT** configure any backend service with:

```
Access-Control-Allow-Origin: *
```

This allows any website to make requests to your API, which creates security vulnerabilities including:

- Cross-site request forgery (CSRF)
- Data exfiltration from authenticated endpoints
- Credential theft via malicious third-party sites

## Recommended Configuration

Only allow the Shield360 platform domain:

**Allowed Origin:**
```
https://shield360-platform.web.app
```

If you also use a custom domain:
```
https://shield360.yourdomain.com
```

During local development, you may additionally allow:
```
http://localhost:5173
```

---

## Backend Configuration Examples

### Express.js (Node.js)

```javascript
const cors = require("cors");

const allowedOrigins = [
  "https://shield360-platform.web.app",
  // Add custom domain if applicable
  // "https://shield360.yourdomain.com",
];

// Add localhost only in development
if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:5173");
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
```

### Flask (Python)

```python
from flask_cors import CORS

allowed_origins = [
    "https://shield360-platform.web.app",
]

if os.environ.get("FLASK_ENV") == "development":
    allowed_origins.append("http://localhost:5173")

CORS(app, origins=allowed_origins, supports_credentials=True)
```

### Nginx (Reverse Proxy)

```nginx
server {
    location /api/ {
        # Only allow specific origin
        set $cors_origin "";
        if ($http_origin = "https://shield360-platform.web.app") {
            set $cors_origin $http_origin;
        }

        add_header Access-Control-Allow-Origin $cors_origin always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;

        if ($request_method = OPTIONS) {
            return 204;
        }

        proxy_pass http://backend;
    }
}
```

---

## Additional Security Headers

Each backend should also set:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Frontend Notes

The Shield360 frontend does **not** assume open CORS. All API requests are made via `axios` with standard headers and will fail gracefully (showing "Service unavailable") if CORS is not configured correctly. Errors are logged to the browser console with a `[Shield360]` prefix for debugging.
