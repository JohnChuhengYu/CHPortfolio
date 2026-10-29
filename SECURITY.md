# Security Policy

## 🛡 Supported Versions

Security updates and vulnerability patches are actively maintained for the current production stack:

| Component | Version | Supported |
| :--- | :--- | :---: |
| Backend | ASP.NET Core 10.x | :white_check_mark: |
| Frontend | React 19.x | :white_check_mark: |
| Database | PostgreSQL 17.x | :white_check_mark: |

---

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability in **CHPortfolio**, please report it responsibly. **Do not create public GitHub issues for sensitive security vulnerabilities.**

### How to Report:
1. Send an email directly to **ych0911y@gmail.com** with the subject line:
   `[SECURITY] CHPortfolio Vulnerability Report`
2. Include the following details:
   - Type of vulnerability (e.g. CSRF, XSS, Auth Bypass, SQLi, Broken Access Control)
   - Detailed steps to reproduce the issue
   - Proof of Concept (PoC) scripts or HTTP requests, if applicable
   - Potential impact of the vulnerability
   - Your contact information for follow-up questions

### Our Commitment:
- We will acknowledge receipt of your vulnerability report within **48 hours**.
- We will provide a status update within **7 days** with validation and remediation timelines.
- We will notify you once a patch has been merged and deployed before any public disclosure.

---

## 🛡 Security Architecture Highlights

### 1. Dual-Path Google OAuth 2.0 Verification
- Google ID tokens are verified cryptographically using `GoogleJsonWebSignature.ValidateAsync()` against Google's official public keys.
- Tokens are rejected if expired, signed by an untrusted audience, or forged.

### 2. Role-Based Access Control (RBAC)
- Sensitive administrative routes (`/api/admin/*`, comment moderation, direct content mutations) require explicit verification against hardcoded administrator emails.
- Unauthorized requests receive `401 Unauthorized` or `403 Forbidden` responses.

### 3. Media Upload Safeguards
- File uploads are strictly restricted to image MIME types (`image/jpeg`, `image/png`, `image/gif`, `image/webp`).
- Unique GUID filenames are generated upon upload to prevent directory traversal and arbitrary file overwrite attacks.
- Maximum payload sizes are enforced at both reverse proxy (25MB) and application levels.

