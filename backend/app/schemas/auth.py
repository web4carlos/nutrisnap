from datetime import datetime
from uuid import UUID
from pydantic import BaseModel,ConfigDict,EmailStr,Field,field_validator
from app.models.user import UserRole
class RegisterRequest(BaseModel):
    email:EmailStr; password:str=Field(min_length=10,max_length=128); first_name:str=Field(min_length=1,max_length=100); last_name:str=Field(min_length=1,max_length=100)
    @field_validator("email")
    @classmethod
    def email_normalize(cls,v):return str(v).strip().lower()
    @field_validator("password")
    @classmethod
    def password_strength(cls,v):
        if not(all((any(c.islower() for c in v),any(c.isupper() for c in v),any(c.isdigit() for c in v)))):raise ValueError("Password requires lowercase, uppercase, and number")
        return v
class LoginRequest(BaseModel):
    email:EmailStr; password:str=Field(min_length=1,max_length=128)
    @field_validator("email")
    @classmethod
    def email_normalize(cls,v):return str(v).strip().lower()
class RefreshRequest(BaseModel):refresh_token:str=Field(min_length=20)
class LogoutRequest(BaseModel):refresh_token:str=Field(min_length=20)
class UserResponse(BaseModel):
    model_config=ConfigDict(from_attributes=True)
    id:UUID; email:EmailStr; first_name:str; last_name:str; role:UserRole; is_active:bool; is_verified:bool; created_at:datetime
class TokenPairResponse(BaseModel):
    access_token:str; refresh_token:str; token_type:str="bearer"; expires_in:int; user:UserResponse
class MessageResponse(BaseModel):message:str
