
import sys
import os
import time
import random

print("🧪 Google Scholar Isolation Test")
print("=================================")

try:
    import scholarly
    print(f"✅ scholarly library found (version: {scholarly.__version__ if hasattr(scholarly, '__version__') else 'unknown'})")
    from scholarly import scholarly as sch, ProxyGenerator
except ImportError:
    print("❌ scholarly library NOT found. Please install it: pip install scholarly")
    sys.exit(1)

def test_connection():
    print("\n1. Testing Proxy Configuration...")
    
    pg = None
    scraper_key = os.getenv('SCRAPER_API_KEY')
    
    if scraper_key:
        print(f"   Using ScraperAPI key: {scraper_key[:4]}...{scraper_key[-4:]}")
        try:
            pg = ProxyGenerator()
            success = pg.ScraperAPI(scraper_key)
            if success:
                sch.use_proxy(pg)
                print("   ✅ ScraperAPI configured")
            else:
                print("   ❌ ScraperAPI configuration failed")
        except Exception as e:
            print(f"   ❌ Validation error: {e}")
    elif os.getenv('USE_TOR') == 'true':
        print("   Using Tor proxy...")
        try:
            pg = ProxyGenerator()
            pg.Tor_External(tor_sock_port=9050, tor_control_port=9051, tor_password=os.getenv('TOR_PASSWORD', ''))
            sch.use_proxy(pg)
            print("   ✅ Tor proxy configured")
        except Exception as e:
             print(f"   ❌ Tor error: {e}")
    else:
        print("   ⚠️  No proxy configured (using direct connection)")

    print("\n2. Testing Search (Query: 'machine learning')...")
    try:
        # Add delay just in case
        time.sleep(2)
        search_query = sch.search_pubs("machine learning")
        print("   ✅ Search object created")
        
        print("   Fetching first result...")
        result = next(search_query)
        title = result.get('bib', {}).get('title', 'No title')
        print(f"   🎉 SUCCESS! Found paper: '{title}'")
        return True
        
    except StopIteration:
        print("   ⚠️  No results found (but no error)")
        return True
    except Exception as e:
        print(f"\n   ❌ FAILED: {str(e)}")
        if "Cannot Fetch" in str(e) or "429" in str(e):
            print("\n   ⚠️  Your IP is blocked by Google Scholar.")
            print("   Solution: Use ScraperAPI or wait 30-60m.")
        return False

if __name__ == "__main__":
    test_connection()
