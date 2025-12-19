import requests
import json

def test_api_endpoints():
    try:
        # Test if the API is running by accessing the root endpoint
        response = requests.get('http://localhost:8001/')
        if response.status_code == 200:
            data = response.json()
            print(f"✓ API is running: {data}")
        else:
            print(f"✗ API returned status code: {response.status_code}")
    except Exception as e:
        print(f"✗ Error connecting to API: {e}")

    try:
        # Test if the vision endpoints are available by checking the OpenAPI docs
        response = requests.get('http://localhost:8001/openapi.json')
        if response.status_code == 200:
            data = response.json()
            paths = list(data.get('paths', {}).keys())
            vision_paths = [path for path in paths if 'vision' in path]
            if vision_paths:
                print(f"✓ Vision endpoints are available: {vision_paths}")
            else:
                print("✗ No vision endpoints found in API")
        else:
            print(f"✗ Could not access OpenAPI spec: {response.status_code}")
    except Exception as e:
        print(f"✗ Error accessing OpenAPI spec: {e}")

if __name__ == "__main__":
    test_api_endpoints()