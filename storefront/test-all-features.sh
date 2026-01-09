#!/bin/bash

echo "🧪 TechHub Electronics - Complete Functionality Test"
echo "=================================================="
echo ""

BASE_URL="http://localhost:3000/default-channel"
PASSED=0
FAILED=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}

    echo -n "Testing $name... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response, expected $expected_code)"
        ((FAILED++))
    fi
}

test_content() {
    local name=$1
    local url=$2
    local search_string=$3

    echo -n "Testing $name... "
    content=$(curl -s "$url" 2>/dev/null)

    if echo "$content" | grep -q "$search_string"; then
        echo -e "${GREEN}✓ PASS${NC} (Found: '$search_string')"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Not found: '$search_string')"
        ((FAILED++))
    fi
}

echo "🏠 CORE PAGES"
echo "-------------"
test_endpoint "Homepage" "$BASE_URL" 200
test_endpoint "Products Page" "$BASE_URL/products" 200
test_endpoint "Cart Page" "$BASE_URL/cart" 200
test_endpoint "Login Page" "$BASE_URL/login" 200
test_endpoint "Register Page" "$BASE_URL/register" 200
test_endpoint "Account Page (redirect)" "$BASE_URL/account" 307

echo ""
echo "📱 PRODUCT PAGES"
echo "----------------"
test_endpoint "Product Detail (Apple Juice)" "$BASE_URL/products/apple-juice" 200
test_endpoint "Product Detail (Monospace Tee)" "$BASE_URL/products/ascii-tee" 200

echo ""
echo "🔍 SEARCH & NAVIGATION"
echo "----------------------"
test_endpoint "Search Results" "$BASE_URL/search" 200
test_endpoint "Categories Page" "$BASE_URL/categories" 200

echo ""
echo "🛒 E-COMMERCE FEATURES"
echo "----------------------"
test_content "Products Displayed" "$BASE_URL/products" "Apple Juice"
test_content "Product Prices Shown" "$BASE_URL/products" "USD"
test_content "Add to Cart Button" "$BASE_URL/products/apple-juice" "Add to Cart"

echo ""
echo "🎨 UI COMPONENTS"
echo "----------------"
test_content "Header Present" "$BASE_URL" "TECHHUB"
test_content "Footer Present" "$BASE_URL" "TechHub Electronics"
test_content "Navigation Menu" "$BASE_URL" "Products"
test_content "Cart Icon" "$BASE_URL" "Cart"

echo ""
echo "⚙️ ADVANCED FEATURES"
echo "--------------------"
test_content "Quick View Available" "$BASE_URL/products" "Quick View"
test_content "Wishlist Feature" "$BASE_URL/products" "wishlist"
test_content "Product Filters" "$BASE_URL/products" "filter"
test_content "Sort Options" "$BASE_URL/products" "sort"

echo ""
echo "📊 API CONNECTION"
echo "-----------------"
# Test GraphQL API
api_response=$(curl -s "https://techhub.eu.saleor.cloud/graphql/" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ shop { name } }"}')

if echo "$api_response" | grep -q "Saleor"; then
    echo -e "API Connection: ${GREEN}✓ PASS${NC} (Connected to Saleor Cloud)"
    ((PASSED++))
else
    echo -e "API Connection: ${RED}✗ FAIL${NC} (Cannot reach Saleor API)"
    ((FAILED++))
fi

echo ""
echo "=================================================="
echo "📊 TEST SUMMARY"
echo "=================================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo "Total: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Your store is fully functional!${NC}"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  Some tests failed. Check details above.${NC}"
    exit 1
fi
