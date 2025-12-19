from fastapi import APIRouter, UploadFile, File, HTTPException
import cv2
import numpy as np
from typing import List, Dict, Any
import logging

router = APIRouter(prefix="/vision", tags=["vision"])

logger = logging.getLogger(__name__)

@router.post("/face-detect")
async def detect_faces(image: UploadFile = File(...)):
    """
    Detect faces in an uploaded image using OpenCV's Haar Cascade
    """
    try:
        # Read image file
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Load the pre-trained Haar cascade for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Convert to grayscale for face detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )

        # Prepare response data
        detected_faces = []
        for (x, y, w, h) in faces:
            face_data = {
                "location": {
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h)
                },
                "face_detected": True
            }
            detected_faces.append(face_data)

        return {
            "faces_count": len(detected_faces),
            "faces": detected_faces,
            "image_size": {"height": img.shape[0], "width": img.shape[1]}
        }

    except Exception as e:
        logger.error(f"Error detecting faces: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error detecting faces: {str(e)}")


@router.post("/face-recognize")
async def recognize_faces(known_image: UploadFile = File(...), unknown_image: UploadFile = File(...)):
    """
    Compare faces between two images using basic OpenCV face detection
    """
    try:
        # Read both images
        known_contents = await known_image.read()
        unknown_contents = await unknown_image.read()

        known_nparr = np.frombuffer(known_contents, np.uint8)
        unknown_nparr = np.frombuffer(unknown_contents, np.uint8)

        known_img = cv2.imdecode(known_nparr, cv2.IMREAD_COLOR)
        unknown_img = cv2.imdecode(unknown_nparr, cv2.IMREAD_COLOR)

        if known_img is None or unknown_img is None:
            raise HTTPException(status_code=400, detail="Invalid image file(s)")

        # Load the pre-trained Haar cascade for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Convert to grayscale for face detection
        known_gray = cv2.cvtColor(known_img, cv2.COLOR_BGR2GRAY)
        unknown_gray = cv2.cvtColor(unknown_img, cv2.COLOR_BGR2GRAY)

        # Detect faces in both images
        known_faces = face_cascade.detectMultiScale(
            known_gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )

        unknown_faces = face_cascade.detectMultiScale(
            unknown_gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )

        # For basic face recognition, we just check if both images have faces
        # In a real implementation, you'd use deep learning models for actual recognition
        match = len(known_faces) > 0 and len(unknown_faces) > 0

        return {
            "match": match,
            "known_faces_count": len(known_faces),
            "unknown_faces_count": len(unknown_faces),
            "message": f"Found {len(known_faces)} face(s) in known image and {len(unknown_faces)} face(s) in unknown image"
        }

    except Exception as e:
        logger.error(f"Error recognizing faces: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error recognizing faces: {str(e)}")


@router.post("/object-detect")
async def detect_objects(image: UploadFile = File(...)):
    """
    Detect common objects in an image using OpenCV
    """
    try:
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # For this basic implementation, we'll just return image info
        # In a real implementation, you'd use a pre-trained model like YOLO
        height, width, channels = img.shape

        return {
            "image_info": {
                "height": height,
                "width": width,
                "channels": channels,
                "size_bytes": len(contents)
            },
            "message": "Object detection endpoint ready. Use a pre-trained model for actual object detection."
        }

    except Exception as e:
        logger.error(f"Error detecting objects: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error detecting objects: {str(e)}")