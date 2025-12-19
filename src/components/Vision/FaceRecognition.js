import React, { useState, useRef } from 'react';
import { useAuth } from 'better-auth/react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import './Vision.css';

/**
 * Face Recognition Component
 * Provides face detection and recognition functionality
 */
const FaceRecognition = () => {
  const { session } = useAuth();
  const [image, setImage] = useState(null);
  const [knownImage, setKnownImage] = useState(null);
  const [unknownImage, setUnknownImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('detect'); // 'detect', 'recognize', 'encode'

  const fileInputRef = useRef(null);
  const knownFileInputRef = useRef(null);
  const unknownFileInputRef = useRef(null);

  const handleImageUpload = (e, setImageState) => {
    const file = e.target.files[0];
    if (file) {
      setImageState(file);
    }
  };

  const detectFaces = async () => {
    if (!image) {
      alert('Please upload an image first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('http://localhost:8001/api/vision/face-detect', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error detecting faces:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const recognizeFaces = async () => {
    if (!knownImage || !unknownImage) {
      alert('Please upload both known and unknown images');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('known_image', knownImage);
      formData.append('unknown_image', unknownImage);

      const response = await fetch('http://localhost:8001/api/vision/face-recognize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error recognizing faces:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const detectObjects = async () => {
    if (!image) {
      alert('Please upload an image first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('http://localhost:8001/api/vision/object-detect', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error detecting objects:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'detect':
        return (
          <div className="face-detection-tab">
            <div className="upload-section">
              <h3>Upload Image for Face Detection</h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleImageUpload(e, setImage)}
                accept="image/*"
                className="file-input"
              />
              {image && <p>Selected: {image.name}</p>}
            </div>

            <Button
              onClick={detectFaces}
              disabled={!image || loading}
              className="action-button"
            >
              {loading ? 'Detecting...' : 'Detect Faces'}
            </Button>
          </div>
        );
      case 'recognize':
        return (
          <div className="face-recognition-tab">
            <div className="upload-section">
              <h3>Upload Known Image</h3>
              <input
                type="file"
                ref={knownFileInputRef}
                onChange={(e) => handleImageUpload(e, setKnownImage)}
                accept="image/*"
                className="file-input"
              />
              {knownImage && <p>Known: {knownImage.name}</p>}
            </div>

            <div className="upload-section">
              <h3>Upload Unknown Image</h3>
              <input
                type="file"
                ref={unknownFileInputRef}
                onChange={(e) => handleImageUpload(e, setUnknownImage)}
                accept="image/*"
                className="file-input"
              />
              {unknownImage && <p>Unknown: {unknownImage.name}</p>}
            </div>

            <Button
              onClick={recognizeFaces}
              disabled={!knownImage || !unknownImage || loading}
              className="action-button"
            >
              {loading ? 'Recognizing...' : 'Recognize Faces'}
            </Button>
          </div>
        );
      case 'objects':
        return (
          <div className="object-detection-tab">
            <div className="upload-section">
              <h3>Upload Image for Object Detection</h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleImageUpload(e, setImage)}
                accept="image/*"
                className="file-input"
              />
              {image && <p>Selected: {image.name}</p>}
            </div>

            <Button
              onClick={detectObjects}
              disabled={!image || loading}
              className="action-button"
            >
              {loading ? 'Detecting...' : 'Detect Objects'}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card title="Vision Processing" className="face-recognition-card">
      <div className="face-recognition-container">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'detect' ? 'active' : ''}`}
            onClick={() => setActiveTab('detect')}
          >
            Face Detection
          </button>
          <button
            className={`tab-button ${activeTab === 'recognize' ? 'active' : ''}`}
            onClick={() => setActiveTab('recognize')}
          >
            Face Recognition
          </button>
          <button
            className={`tab-button ${activeTab === 'objects' ? 'active' : ''}`}
            onClick={() => setActiveTab('objects')}
          >
            Object Detection
          </button>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>

        {result && (
          <div className="result-section">
            <h3>Result:</h3>
            <pre className="result-json">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FaceRecognition;