# Hardened WAF / ModSecurity

## What is ModSecurity?
ModSecurity is an open-source Web Application Firewall (WAF) engine that intercepts HTTP/HTTPS requests before they hit your backend application. It operates at Layer 7 (Application Layer).

## OWASP Core Rule Set (CRS)
The OWASP CRS is a collection of generic attack detection rules designed to catch known and unknown vulnerabilities with minimal false positives. It uses **collaborative detection (anomaly scoring)**:
- Each matched rule adds an anomaly score to the transaction.
- If the total score exceeds the configured inbound threshold, ModSecurity blocks the request.

## What Makes It "Hardened"?
1. **Active Blocking Mode:** `SecRuleEngine On` (not `DetectionOnly`). Malicious packets are actively blocked before reaching the backend.
2. **Protocol Validation:** Restricts invalid HTTP methods, missing `Host` headers, and illegal character encodings.
3. **Information Leak Prevention:** Filters response headers to prevent leaking web server signatures (`Server`, `X-Powered-By`).
4. **WebSocket & Long-Polling Protection:** Configured specifically to permit real-time Pong gameplay and chat connections without dropping the connection upgrade.

## Configuration & Tuning for ft_transcendence

### Key `modsecurity.conf` settings:
```apache
# Enable active blocking
SecRuleEngine On

# Request Body Handling (inspect JSON payloads)
SecRequestBodyAccess On
SecRequestBodyLimit 13107200
SecRequestBodyNoFilesLimit 131072

# Response Body Inspection
SecResponseBodyAccess Off

# Audit Logging (records blocked attacks)
SecAuditEngine RelevantOnly
SecAuditLogParts ABIJDEFHZ
SecAuditLogType Serial
SecAuditLog /var/log/modsec_audit.log

### Where is it implemended?

#### Nginx default.conf


