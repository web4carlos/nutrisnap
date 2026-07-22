from dataclasses import dataclass
from uuid import UUID
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.auth.security import TokenDecodeError,TokenType,create_access_token,create_refresh_token,decode_token,hash_password,verify_password
from app.core.config import get_settings

settings = get_settings()

from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenPairResponse
class AuthenticationError(ValueError):pass
class DuplicateEmailError(ValueError):pass
class InactiveUserError(ValueError):pass
@dataclass(slots=True)
class AuthService:
    db:Session
    @property
    def users(self):return UserRepository(self.db)
    def register(self,r):
        if self.users.get_by_email(str(r.email)):raise DuplicateEmailError("Email already registered")
        try:
            u=self.users.create_user(email=str(r.email),password_hash=hash_password(r.password),first_name=r.first_name,last_name=r.last_name)
            out=self._issue(u);self.db.commit();self.db.refresh(u);return out
        except IntegrityError as exc:self.db.rollback();raise DuplicateEmailError("Email already registered") from exc
    def login(self,r):
        u=self.users.get_by_email(str(r.email))
        if u is None or not verify_password(r.password,u.password_hash):raise AuthenticationError("Invalid email or password")
        if not u.is_active:raise InactiveUserError("Account inactive")
        out=self._issue(u);self.db.commit();return out
    def refresh(self,token):
        try:p=decode_token(token,TokenType.REFRESH);uid=UUID(p["sub"]);jti=UUID(p["jti"])
        except (TokenDecodeError,ValueError) as exc:raise AuthenticationError("Invalid refresh token") from exc
        stored=self.users.get_refresh_token(jti)
        if stored is None or not stored.is_active or stored.user_id!=uid:raise AuthenticationError("Refresh token revoked or expired")
        u=self.users.get_by_id(uid)
        if u is None or not u.is_active:raise AuthenticationError("User unavailable")
        self.users.revoke_refresh_token(jti);out=self._issue(u);self.db.commit();return out
    def logout(self,token):
        try:jti=UUID(decode_token(token,TokenType.REFRESH)["jti"])
        except (TokenDecodeError,ValueError) as exc:raise AuthenticationError("Invalid refresh token") from exc
        self.users.revoke_refresh_token(jti);self.db.commit()
    def get_user(self,uid):
        u=self.users.get_by_id(uid)
        if u is None:raise AuthenticationError("User not found")
        if not u.is_active:raise InactiveUserError("Account inactive")
        return u
    def _issue(self,u):
        access,_,_=create_access_token(u.id);refresh,jti,exp=create_refresh_token(u.id)
        self.users.create_refresh_token(user_id=u.id,jti=jti,expires_at=exp)
        return TokenPairResponse(access_token=access,refresh_token=refresh,expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES*60,user=u)
