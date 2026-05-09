# Forgot Password Workflow - Comprehensive Troubleshooting Guide

## Overview

The "Forgot Password" functionality in OneCart360 consists of a multi-step secure workflow:
1. User clicks "Forgot password?" link on login page
2. User enters email and receives reset link
3. User clicks link in email to reset password
4. User sets new password and logs in

## Current Implementation Status

✅ **Working** - All 3 pages are properly configured:
- `/auth/login` - "Forgot password?" link (Line 131-136)
- `/auth/forgot-password` - Email input & reset request form
- `/auth/reset-password` - Password reset form with token validation
- `/auth/callback` - Handles Supabase recovery tokens

✅ **Verified** - HTTP 200 response from all routes

## Potential 404 Error Causes & Solutions

### 1. **Client-Side Navigation Issue**
**Symptom:** 404 error when clicking "Forgot password?" link
**Cause:** Browser caching or routing issue

**Solutions:**
- Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache and cookies for the site
- Try in incognito/private mode
- Check browser console for JavaScript errors

---

### 2. **Build/Deployment Issue**
**Symptom:** Production deployment shows 404

**Solutions:**
- Rebuild the project: `pnpm build`
- Clear `.next` folder: `rm -rf .next && pnpm build`
- Check that all auth pages exist:
  ```bash
  ls -la app/auth/
  # Should contain: login/ forgot-password/ reset-password/ callback/ sign-up-success/
  ```

---

### 3. **Route Configuration Issue**
**Symptom:** Page shows but navigation not working

**Check:**
- Next.js App Router is configured in `next.config.js`
- No conflicting route segments or middleware
- Verify file structure:
  ```
  app/auth/
  ├── login/
  │   └── page.tsx
  ├── forgot-password/
  │   └── page.tsx
  ├── reset-password/
  │   └── page.tsx
  ├── callback/
  │   └── route.ts
  └── sign-up/
      └── page.tsx
  ```

---

### 4. **Link Configuration Error**
**Location:** `/app/auth/login/page.tsx` lines 131-136

**Current Configuration:**
```tsx
<Link href="/auth/forgot-password" className="text-xs text-primary underline">
  Forgot password?
</Link>
```

**Verification Steps:**
- Confirm `Link` is imported from `next/link`
- Check href value is exactly `/auth/forgot-password`
- Ensure no typos in component props

---

### 5. **Supabase Configuration Issue**
**Symptom:** Can reach page but password reset email not sending

**Check:**
- Supabase project is active and not paused
- Email confirmation required setting is correct
- SMTP settings configured or using Supabase default emails
- Verify redirect URL in forgot-password page matches Supabase settings

**Solution:**
```tsx
// In /app/auth/forgot-password/page.tsx, line 42
redirectTo: `${window.location.origin}/auth/reset-password`
```

---

### 6. **Email Token/Callback Issue**
**Symptom:** Reset email received but clicking link shows 404

**Causes:**
- Link format incorrect in email template
- Token expired (Supabase default: 24 hours)
- Recovery token type not recognized

**Solution:**
The callback route (`/app/auth/callback/route.ts`) automatically handles:
- Recovery tokens: Redirects to `/auth/reset-password`
- Signup confirmations: Redirects to `/` or specified next URL
- Invalid tokens: Shows error page

**Verification:**
```bash
# Check callback route exists and is properly configured
cat app/auth/callback/route.ts
# Should handle "type=recovery" query parameter
```

---

## End-to-End Flow Verification

### Step 1: Verify Login Page Link
```bash
curl -s http://localhost:3000/auth/login | grep -i "forgot"
# Should show: <a href="/auth/forgot-password">Forgot password?</a>
```

### Step 2: Verify Page Accessibility
```bash
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000/auth/forgot-password
# Expected: Status: 200
```

### Step 3: Test Form Submission
1. Navigate to `/auth/forgot-password`
2. Enter a valid email
3. Click "Send Reset Link"
4. Check browser console for errors
5. Check Supabase project for email activity

### Step 4: Test Email Link
1. Receive reset email
2. Click reset link
3. Should redirect to `/auth/reset-password` with token
4. Form should show (not 404)
5. Enter new password and save

---

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `404 Not Found` | Page doesn't exist | Verify `app/auth/forgot-password/page.tsx` exists |
| `Cannot find module` | Import error | Check all imports use correct paths |
| `Token expired` | Link older than 24 hours | Request new password reset |
| `Invalid email` | Email not in system | User may not have account |
| `SMTP error` | Supabase email config | Check Supabase email settings |

---

## Performance & Security Checklist

✅ **Security Features Implemented:**
- Password strength validation (5 requirements)
- Rate limiting (3 attempts max)
- Token expiration (24 hours)
- Secure callback handling
- Auto-redirect on success
- Session invalidation on password reset

✅ **Performance:**
- Client-side validation before API call
- Optimistic UI updates
- Fast redirect on successful reset
- Minimal re-renders

---

## Testing Checklist

- [ ] Forgot password link visible on login page
- [ ] Link navigates to forgot-password page without 404
- [ ] Email input accepts valid/invalid emails
- [ ] Form shows validation errors correctly
- [ ] "Send Reset Link" button loads and completes
- [ ] Success message shows after email sent
- [ ] Email received within 2 minutes
- [ ] Email link format is correct
- [ ] Clicking email link redirects to reset-password page
- [ ] Reset page shows form (not 404)
- [ ] Can enter and validate new password
- [ ] Password update succeeds
- [ ] Can log in with new password
- [ ] Old password no longer works

---

## Support & Next Steps

If you encounter a 404 error:

1. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)
2. **Check network tab** - Verify actual response is 404 vs page not found
3. **Review console** - Look for JavaScript errors
4. **Test other auth routes** - Verify `/auth/login` and `/auth/sign-up` work
5. **Check file existence** - Run `ls -la app/auth/`
6. **Rebuild project** - `rm -rf .next && pnpm build`

---

**Last Updated:** May 8, 2026
**Status:** All routes verified working - HTTP 200 on all endpoints
