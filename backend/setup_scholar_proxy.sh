#!/bin/bash

# Quick Setup Script for Google Scholar Access
# This script helps you configure proxy settings for the Research Assistant

echo "=============================================="
echo "🔧 Google Scholar Access Configuration"
echo "=============================================="
echo ""

echo "Google Scholar is currently blocking direct requests."
echo "You need to configure a proxy to access it."
echo ""

echo "Available options:"
echo ""
echo "1. ScraperAPI (Recommended - Most Reliable)"
echo "   - Free tier: 1,000 requests/month"
echo "   - Paid: Starting at \$49/month for 100K requests"
echo "   - Sign up at: https://www.scraperapi.com"
echo ""
echo "2. Tor Proxy (Free but requires setup)"
echo "   - Requires Tor browser or service installed"
echo "   - Slower than ScraperAPI"
echo ""
echo "3. Wait and retry later (Temporary fix)"
echo "   - Wait 30-60 minutes and try again"
echo "   - Google may unblock your IP"
echo ""

read -p "Which option would you like to configure? (1/2/3): " choice

case $choice in
  1)
    echo ""
    echo "Setting up ScraperAPI..."
    echo ""
    read -p "Enter your ScraperAPI key: " api_key
    
    if [ -z "$api_key" ]; then
      echo "❌ No API key provided. Exiting."
      exit 1
    fi
    
    # Add to environment
    export SCRAPER_API_KEY="$api_key"
    
    # Add to .env file if it exists, or create one
    if [ -f .env ]; then
      # Remove existing entry if present
      sed -i '/SCRAPER_API_KEY/d' .env
    fi
    echo "SCRAPER_API_KEY=$api_key" >> .env
    
    echo ""
    echo "✅ ScraperAPI key saved!"
    echo ""
    echo "Next steps:"
    echo "1. Restart your backend server"
    echo "2. You should see: '✅ Using ScraperAPI for Google Scholar requests'"
    echo "3. Try your search again"
    echo ""
    ;;
    
  2)
    echo ""
    echo "Setting up Tor proxy..."
    echo ""
    
    # Check if Tor is installed
    if command -v tor &> /dev/null; then
      echo "✅ Tor is installed"
    else
      echo "❌ Tor is not installed."
      echo ""
      echo "To install Tor:"
      echo "  Ubuntu/Debian: sudo apt-get install tor"
      echo "  Fedora: sudo dnf install tor"
      echo "  Arch: sudo pacman -S tor"
      echo ""
      read -p "Would you like to continue anyway? (y/n): " continue
      if [ "$continue" != "y" ]; then
        exit 1
      fi
    fi
    
    # Set environment variable
    export USE_TOR=true
    
    # Add to .env file
    if [ -f .env ]; then
      sed -i '/USE_TOR/d' .env
    fi
    echo "USE_TOR=true" >> .env
    
    echo ""
    echo "✅ Tor proxy enabled!"
    echo ""
    echo "Next steps:"
    echo "1. Make sure Tor service is running: sudo systemctl start tor"
    echo "2. Restart your backend server"
    echo "3. Try your search again"
    echo ""
    ;;
    
  3)
    echo ""
    echo "ℹ️  Recommended actions:"
    echo ""
    echo "1. Stop your backend server (Ctrl+C)"
    echo "2. Wait 30-60 minutes"
    echo "3. Try searching again"
    echo ""
    echo "Alternatively, you can reduce the frequency of searches"
    echo "or use one of the proxy options above."
    echo ""
    ;;
    
  *)
    echo "❌ Invalid option. Please run the script again."
    exit 1
    ;;
esac

echo "=============================================="
echo "Configuration complete!"
echo "=============================================="
