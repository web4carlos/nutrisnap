from datetime import timedelta
from uuid import uuid4
import pytest
from app.auth.security import TokenDecodeError,TokenType,_create_token,decode_token,hash_password,verify_password
def test_password_hash_round_trip():
    p="NutriSnap42Secure";h=hash_password(p);assert h!=p;assert verify_password(p,h);assert not verify_password("wrong",h)
def test_token_round_trip():
    uid=uuid4();t,_,_=_create_token(subject=uid,token_type=TokenType.ACCESS,expires_delta=timedelta(minutes=5));assert decode_token(t,TokenType.ACCESS)["sub"]==str(uid)
def test_wrong_type_rejected():
    t,_,_=_create_token(subject=uuid4(),token_type=TokenType.REFRESH,expires_delta=timedelta(minutes=5))
    with pytest.raises(TokenDecodeError):decode_token(t,TokenType.ACCESS)
