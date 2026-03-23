from fastapi import FastAPI, UploadFile, File, Form, HTTPException
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
from vertexai.preview.vision_models import ImageGenerationModel, Image as VertexImage

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
credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
project_id = os.getenv("GOOGLE_CLOUD_PROJECT")

imagen_model = None

if credentials_path and project_id:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
    aiplatform.init(project=project_id, location="us-central1")
    try:
        imagen_model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")
        print("Vertex AI Imagen (generation) model loaded successfully!")
    except Exception as e:
        print(f"Failed to load Imagen generation model: {e}")
else:
    print("Vertex AI not configured. Set GOOGLE_CLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS in .env")


@app.post("/genai-visualize")
async def genai_visualize(
    room_image: UploadFile = File(...),
    product_image: UploadFile = File(...),
    product_name: str = Form(default="selected granite")
):
    """
    AI Room Visualizer — Strategy: Option 1 + Option 3
    1. Hyper-specific Gemini Vision analysis with the product name baked into the prompt.
    2. Imagen generation from the ultra-detailed prompt.
    """
    try:
        # Read and process images
        room_bytes = await room_image.read()
        product_bytes = await product_image.read()

        img_room = Image.open(io.BytesIO(room_bytes))
        img_product = Image.open(io.BytesIO(product_bytes))

        analysis_prompt = f"""
        You are a professional interior design rendering AI and material science expert.
        Image 1 is a room photo. Image 2 is the granite/tile texture sample for "{product_name}" to be applied to the floor.

        Your job: Write a precise, technical image-generation prompt for Imagen 3 that describes
        photorealistically replacing ONLY the floor surface in Image 1 with the "{product_name}" granite from Image 2.

        STEP A — Analyze the "{product_name}" GRANITE TEXTURE (Image 2) with maximum technical precision:
        - Dominant base color (provide a specific color name + approximate hex)
        - Secondary/accent colors and their distribution (e.g., "fine white quartz veins running diagonally")
        - Veining pattern: direction, width, frequency, contrast level
        - Surface finish: polished/honed/matte/brushed — and how light interacts with it
        - Grain size: coarse, medium, fine
        - Tile layout in the room: random, book-matched, 60x60, herringbone, etc. (infer a natural layout)
        - Any movement or directional flow in the stone pattern

        STEP B — Describe the ROOM (Image 1) to be FULLY PRESERVED:
        - Camera angle, perspective, focal length feel
        - Every wall: exact color, material, texture
        - Ceiling: color, height, lights, features
        - Every piece of furniture: type, exact color, position, material, style
        - All objects, decor, plants, art — position and appearance
        - Windows, doors, curtains — style and position
        - Current lighting: direction, warmth (cool/warm), shadows cast

        STEP C — Describe the FLOOR CHANGE using "{product_name}":
        Using the granite analysis from Step A, describe the new floor:
        - Full technical description of the "{product_name}" granite as it tiles across the floor
        - How the polished/matte surface catches the room's existing light sources
        - Realistic reflections or shadows visible on the new floor surface

        CRITICAL CONSTRAINTS to include in the prompt:
        - "Do NOT alter any furniture, walls, ceiling, doors, windows, decorations, or objects"
        - "Preserve the exact room layout, proportions, and all non-floor surfaces identically"
        - "Only the floor material changes — everything else is pixel-identical to the original"
        - "Photorealistic interior photograph, shot on high-resolution DSLR camera, natural lighting"

        OUTPUT: Return ONLY the final image generation prompt as a single plain-text paragraph.
        Do not include markdown, labels, section headers, or explanations.
        """

        # Send both images to Gemini for deep analysis
        response = vision_model.generate_content([analysis_prompt, img_room, img_product])
        generated_prompt = response.text.strip()
        print(f"[Gemini Prompt Generated]: {generated_prompt[:300]}...")

        # Generate image using Vertex AI Imagen
        if not imagen_model:
            raise HTTPException(
                status_code=503,
                detail="Vertex AI Imagen is not configured. Set GOOGLE_CLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS in .env"
            )

        images = imagen_model.generate_images(
            prompt=generated_prompt,
            number_of_images=1,
            aspect_ratio="1:1"
        )
        
        generated_image = images[0]
        img_byte_arr = io.BytesIO()
        generated_image._pil_image.save(img_byte_arr, format='JPEG', quality=95)
        base64_image = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

        ai_suggestion = (
            f"Here is an AI-enhanced visualization of your room with {product_name} applied to the floor. "
            "The granite texture, veining, and finish have been precisely matched to the product sample."
        )

        return {
            "generated_image_base64": f"data:image/jpeg;base64,{base64_image}",
            "ai_suggestion": ai_suggestion
        }

    except Exception as e:
        print(f"Visualizer Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

