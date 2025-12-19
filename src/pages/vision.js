import React from 'react';
import Layout from '@theme/Layout';
import FaceRecognition from '../components/Vision/FaceRecognition';

function VisionPage() {
  return (
    <Layout title="Vision Processing" description="Face recognition and computer vision capabilities">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12 col--offset-0">
            <h1>Vision Processing</h1>
            <p>Advanced face recognition and computer vision capabilities for humanoid robotics.</p>

            <FaceRecognition />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default VisionPage;