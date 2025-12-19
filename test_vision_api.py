import requests
import json

def test_vision_api():
    try:
        # Test the root API endpoint
        response = requests.get('http://localhost:8001/')
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: API is running: {data}")
        else:
            print(f"ERROR: API returned status code: {response.status_code}")
    except Exception as e:
        print(f"ERROR: Error connecting to API: {e}")
        return

    try:
        # Test the OpenAPI spec to see if vision endpoints are registered
        response = requests.get('http://localhost:8001/openapi.json')
        if response.status_code == 200:
            data = response.json()
            paths = list(data.get('paths', {}).keys())
            vision_paths = [path for path in paths if 'vision' in path]
            if vision_paths:
                print(f"SUCCESS: Vision endpoints are available: {vision_paths}")
                return True
            else:
                print("ERROR: No vision endpoints found in API")
                return False
        else:
            print(f"ERROR: Could not access OpenAPI spec: {response.status_code}")
            return False
    except Exception as e:
        print(f"ERROR: Error accessing OpenAPI spec: {e}")
        return False

if __name__ == "__main__":
    success = test_vision_api()
    if success:
        print("\nSUCCESS: All vision API endpoints are successfully running!")
    else:
        print("\nERROR: There were issues with the vision API endpoints.")