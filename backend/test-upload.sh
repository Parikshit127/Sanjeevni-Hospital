#!/bin/bash

# Test if upload endpoint exists
echo "Testing upload endpoint..."
echo ""

# Test without auth (should fail with 401)
echo "1. Testing without authentication (should return 401):"
curl -X POST http://localhost:5001/api/upload/image \
  -H "Content-Type: multipart/form-data" \
  2>/dev/null | jq . || echo "Route not found or server not responding"

echo ""
echo "2. Checking if /uploads directory exists:"
ls -la /Users/parikshitkaushal/Downloads/Sanjivani-Hospital/backend/uploads 2>/dev/null || echo "Directory not created yet"

echo ""
echo "3. Testing static file serving:"
echo "Visit: http://localhost:5001/uploads/ (should show directory listing or 404 if empty)"
