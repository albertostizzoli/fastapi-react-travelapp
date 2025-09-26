import os
from dotenv import load_dotenv
import cloudinary

# carico variabili da .env
load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME_CLOUDINARY"),
    api_key=os.getenv("API_KEY_CLOUDINARY"),
    api_secret=os.getenv("API_SECRET_CLOUDINARY")
)
