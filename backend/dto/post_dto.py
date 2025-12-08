from pydantic import BaseModel
from typing import Optional

class PostCreateRequest(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class PostUpdateRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
