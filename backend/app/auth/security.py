from __future__ import annotations
from datetime import UTC, datetime, timedelta
from enum import StrEnum
from typing import Any
from uuid import UUID, uuid4
import jwt
from jwt import InvalidTokenError
from pwdlib import PasswordHash
from app.core.config import get_settings

settings = get_settings()

class TokenType(StrEnum):
    ACCESS="access"
    REFRESH="refresh"
class TokenDecodeError(ValueError): pass
password_hash=PasswordHash.recommended()
def hash_password(password:str)->str:return password_hash.hash(password)
def verify_password(password:str,encoded:str)->bool:return password_hash.verify(password,encoded)
def _create_token(*,subject:UUID,token_type:TokenType,expires_delta:timedelta):
    now=datetime.now(UTC); exp=now+expires_delta; jti=uuid4()
    payload:dict[str,Any]={"sub":str(subject),"type":token_type.value,"jti":str(jti),"iat":now,"exp":exp}
    return jwt.encode(payload,settings.JWT_SECRET_KEY,algorithm=settings.JWT_ALGORITHM),jti,exp
def create_access_token(subject:UUID):return _create_token(subject=subject,token_type=TokenType.ACCESS,expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
def create_refresh_token(subject:UUID):return _create_token(subject=subject,token_type=TokenType.REFRESH,expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
def decode_token(token:str,expected_type:TokenType)->dict[str,Any]:
    try: payload=jwt.decode(token,settings.JWT_SECRET_KEY,algorithms=[settings.JWT_ALGORITHM])
    except InvalidTokenError as exc: raise TokenDecodeError("Invalid or expired token") from exc
    if payload.get("type")!=expected_type.value: raise TokenDecodeError("Incorrect token type")
    if any(not payload.get(k) for k in ("sub","jti","exp")): raise TokenDecodeError("Missing token claims")
    return payload
