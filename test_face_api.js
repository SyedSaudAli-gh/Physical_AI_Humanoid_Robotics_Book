const testFaceRecognition = async () => {
  try {
    // Create a simple test to verify the endpoints exist
    console.log('Testing face recognition API endpoints...');

    // Test the API root to see if the vision endpoints are registered
    const response = await fetch('http://localhost:8001/docs');
    if (response.ok) {
      const html = await response.text();
      console.log('API documentation loaded successfully');
      if (html.includes('vision')) {
        console.log('✓ Vision endpoints are available in the API');
      } else {
        console.log('⚠ Vision endpoints may not be registered properly');
      }
    } else {
      console.log('✗ Could not access API documentation');
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
};

testFaceRecognition();