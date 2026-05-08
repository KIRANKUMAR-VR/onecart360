#!/bin/bash

# Forgot Password Workflow - Route Diagnostics Script
# Verifies all routes are accessible and properly configured

echo "🔍 OneCart360 - Forgot Password Workflow Diagnostics"
echo "===================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="${1:-http://localhost:3000}"

echo "📍 Testing: $BASE_URL"
echo ""

# Test each route
test_route() {
  local route=$1
  local description=$2
  
  echo -n "Testing $route... "
  
  status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
  
  if [ "$status" = "200" ]; then
    echo -e "${GREEN}✓ $status${NC} - $description"
    return 0
  else
    echo -e "${RED}✗ $status${NC} - $description"
    return 1
  fi
}

# Test all auth routes
echo "🔐 Authentication Routes:"
test_route "/auth/login" "Login page"
test_route "/auth/sign-up" "Sign up page"
test_route "/auth/forgot-password" "Forgot password page"
test_route "/auth/reset-password" "Reset password page"
test_route "/auth/sign-up-success" "Sign up success page"

echo ""
echo "📋 File Structure Check:"
echo -n "Login page exists... "
if [ -f "app/auth/login/page.tsx" ]; then echo -e "${GREEN}✓${NC}"; else echo -e "${RED}✗${NC}"; fi

echo -n "Forgot password page exists... "
if [ -f "app/auth/forgot-password/page.tsx" ]; then echo -e "${GREEN}✓${NC}"; else echo -e "${RED}✗${NC}"; fi

echo -n "Reset password page exists... "
if [ -f "app/auth/reset-password/page.tsx" ]; then echo -e "${GREEN}✓${NC}"; else echo -e "${RED}✗${NC}"; fi

echo -n "Callback route exists... "
if [ -f "app/auth/callback/route.ts" ]; then echo -e "${GREEN}✓${NC}"; else echo -e "${RED}✗${NC}"; fi

echo ""
echo "🔗 Link Configuration Check:"
echo -n "Forgot password link in login page... "
if grep -q 'href="/auth/forgot-password"' app/auth/login/page.tsx; then 
  echo -e "${GREEN}✓${NC}"
else 
  echo -e "${RED}✗${NC}"
fi

echo ""
echo "✅ Diagnostics Complete!"
echo ""
echo "💡 Next Steps:"
echo "1. If all tests pass (✓), forgot password is working correctly"
echo "2. If you see ✗ errors, check the FORGOT_PASSWORD_TROUBLESHOOTING.md guide"
echo "3. For 404 errors, verify files exist: ls -la app/auth/"
echo "4. Clear cache if needed: rm -rf .next && pnpm build"
