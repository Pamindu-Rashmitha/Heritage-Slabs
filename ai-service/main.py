from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import google.generativeai as genai
from PIL import Image
import io
import os
import base64
from dotenv import load_dotenv
import joblib
import numpy as np

# Vertex AI imports for Imagen
import google.cloud.aiplatform as aiplatform
from vertexai.preview.vision_models import ImageGenerationModel

load_dotenv()

# Configure Gemini for vision/text tasks
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI(title="BuildVision AI Visualizer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Models
# Vision Model: Gemini for describing images and generating prompts
vision_model = genai.GenerativeModel('gemini-2.5-flash') 

# Image Generation Model: Vertex AI Imagen
# Set up authentication via service account JSON key
credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
project_id = os.getenv("GOOGLE_CLOUD_PROJECT")

if credentials_path and project_id:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
    aiplatform.init(project=project_id, location="us-central1")
    try:
        imagen_model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")
        print("Vertex AI Imagen model loaded successfully!")
    except Exception as e:
        imagen_model = None
        print(f"Failed to load Imagen model: {e}")
else:
    imagen_model = None
    print("Vertex AI not configured. Set GOOGLE_CLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS in .env")

@app.post("/genai-visualize")
async def genai_visualize(
    room_image: UploadFile = File(...),
    product_image: UploadFile = File(...)
):
    """
    AI Room Visualizer (True GenAI):
    1. Uses Gemini Vision to understand the room and the granite.
    2. Uses Imagen to generate a photorealistic result.
    """
    try:
        # Read and Process Images
        room_bytes = await room_image.read()
        product_bytes = await product_image.read()
        
        img_room = Image.open(io.BytesIO(room_bytes))
        img_product = Image.open(io.BytesIO(product_bytes))

        # Analyze images to create a perfect prompt
        # We ask Gemini to describe the room but swap the floor
        analysis_prompt = """
        You are an interior design AI helper.
        Image 1 is the User's Room.
        Image 2 is the Granite Texture they want.
        
        Task: Write a detailed image generation prompt to re-create Image 1 but with the flooring from Image 2.
        
        Rules for the prompt:
        - Describe the room's angle, lighting, furniture, and style exactly as seen in Image 1.
        - Describe the flooring explicitly as the granite seen in Image 2 (mention its color, pattern, and finish).
        - The goal is to make a "Renovated" version of Image 1.
        - Output ONLY the prompt string, no markdown.
        """
        
        # Send both images to Gemini 2.5 Flash
        response = vision_model.generate_content([analysis_prompt, img_room, img_product])
        generated_prompt = response.text.strip()

        # Generate the new Image using Vertex AI Imagen
        if imagen_model:
            # Generate 1 image using Vertex AI
            images = imagen_model.generate_images(
                prompt=generated_prompt,
                number_of_images=1,
                aspect_ratio="1:1" 
            )
            
            # Get the first image
            generated_image = images[0]
            
            # Convert to base64 to send back to React
            img_byte_arr = io.BytesIO()
            generated_image._pil_image.save(img_byte_arr, format='JPEG')
            base64_image = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')
            
            ai_suggestion = "Here is a realistic AI generation of your room with the selected granite. Notice how the lighting reflects off the polished surface."
        
        else:
            # Fallback if Imagen is not configured
            raise HTTPException(status_code=503, detail="Vertex AI Imagen not configured. Please set GOOGLE_CLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS in .env")

        return {
            "generated_image_base64": f"data:image/jpeg;base64,{base64_image}",
            "ai_suggestion": ai_suggestion
        }

    except Exception as e:
        print(f"Visualizer Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))