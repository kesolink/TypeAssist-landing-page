# Environment Variables Setup Guide

## 📝 Overview

This project uses environment variables to manage configuration across different environments (development, staging, production).

## 📁 Environment Files

### `.env` (Production)
Contains production configuration. **Already created and configured.**

```env
VITE_API_BASE_URL=https://typeassist-backend.onrender.com
VITE_SUPPORT_EMAIL=support@typeassist.com
VITE_APP_NAME=TypeAssist
VITE_APP_VERSION=1.0.0
```

### `.env.example`
Template file for production configuration. Committed to git.

### `.env.local` (Local Development)
For local overrides. Create this file if you want to use a local backend.

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit with your local settings
# VITE_API_BASE_URL=http://localhost:3000
```

## 🔑 Environment Variables

### `VITE_API_BASE_URL`
**Description**: Backend API base URL
**Production**: `https://typeassist-backend.onrender.com`
**Local Dev**: `http://localhost:3000` (if running backend locally)
**Required**: Yes

### `VITE_SUPPORT_EMAIL`
**Description**: Support email address
**Default**: `support@typeassist.com`
**Required**: No

### `VITE_APP_NAME`
**Description**: Application name
**Default**: `TypeAssist`
**Required**: No

### `VITE_APP_VERSION`
**Description**: Application version
**Default**: `1.0.0`
**Required**: No

## 🚀 Usage in Code

### Accessing Environment Variables

```javascript
// In any JS/JSX file
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL;
```

### Example: API Configuration

```javascript
// src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://typeassist-backend.onrender.com';
```

## 📋 Setup Instructions

### For Production Deployment

1. **Vercel/Netlify/etc.**
   - Add environment variables in the deployment platform dashboard
   - Use the values from `.env.example`

2. **Environment Variables to Add:**
   ```
   VITE_API_BASE_URL=https://typeassist-backend.onrender.com
   VITE_SUPPORT_EMAIL=support@typeassist.com
   ```

### For Local Development

1. **Using Production API** (Default)
   ```bash
   # No changes needed - uses .env by default
   npm run dev
   ```

2. **Using Local Backend**
   ```bash
   # Create local environment file
   cp .env.local.example .env.local

   # Edit .env.local
   # Uncomment and set: VITE_API_BASE_URL=http://localhost:3000

   # Start dev server
   npm run dev
   ```

## 🔒 Security Notes

### ✅ Safe to Commit
- `.env.example` - Template with example values
- `.env.local.example` - Template for local development

### ❌ Never Commit
- `.env` - Contains actual configuration
- `.env.local` - Personal local overrides
- `.env.*.local` - Any local environment files

These files are already in `.gitignore`.

## 🌍 Environment Hierarchy

Vite loads environment files in this order (later files override earlier ones):

1. `.env` - Base configuration (all environments)
2. `.env.local` - Local overrides (ignored by git)
3. `.env.[mode]` - Mode-specific (e.g., `.env.production`)
4. `.env.[mode].local` - Mode-specific local overrides

## 🛠️ Common Scenarios

### Scenario 1: Development with Production API
```bash
# Use default .env
npm run dev
# Uses: https://typeassist-backend.onrender.com
```

### Scenario 2: Development with Local Backend
```bash
# Create .env.local
echo "VITE_API_BASE_URL=http://localhost:3000" > .env.local

npm run dev
# Uses: http://localhost:3000
```

### Scenario 3: Build for Production
```bash
npm run build
# Uses: .env values
```

## 🧪 Testing Environment Variables

Create a test component to verify variables are loaded:

```jsx
// src/components/EnvTest.jsx
export default function EnvTest() {
  return (
    <div>
      <p>API URL: {import.meta.env.VITE_API_BASE_URL}</p>
      <p>Support Email: {import.meta.env.VITE_SUPPORT_EMAIL}</p>
      <p>App Name: {import.meta.env.VITE_APP_NAME}</p>
      <p>Version: {import.meta.env.VITE_APP_VERSION}</p>
    </div>
  );
}
```

## ⚠️ Important Notes

### Vite-Specific Rules

1. **Prefix Requirement**
   - Only variables prefixed with `VITE_` are exposed to the client
   - Other variables are NOT accessible in browser code

2. **Static Replacement**
   - Environment variables are statically replaced at build time
   - They are NOT reactive - require rebuild after changes

3. **Restart Required**
   - After changing `.env` files, restart the dev server:
     ```bash
     # Stop server (Ctrl+C)
     npm run dev
     ```

### Best Practices

1. **Never expose secrets**
   - Don't put API keys, passwords, or secrets in VITE_ variables
   - They will be visible in the browser bundle

2. **Use for configuration only**
   - API URLs
   - Feature flags
   - Public configuration

3. **Document all variables**
   - Keep `.env.example` updated
   - Add comments explaining each variable

## 🔗 Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vite Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html#env-variables)

## 📞 Need Help?

If you have questions about environment configuration:
- Check this guide first
- Review Vite documentation
- Contact: support@typeassist.com

---

**Last Updated**: February 16, 2026
**Vite Version**: 7.3.1
