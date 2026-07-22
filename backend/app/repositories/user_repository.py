from datetime import UTC,datetime
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.user import RefreshToken,User
class UserRepository:
    def __init__(self,db:Session):self.db=db
    def get_by_email(self,email:str):return self.db.scalar(select(User).where(User.email==email))
    def get_by_id(self,user_id:UUID):return self.db.get(User,user_id)
    def create_user(self,**data):u=User(**data);self.db.add(u);self.db.flush();return u
    def create_refresh_token(self,**data):t=RefreshToken(**data);self.db.add(t);self.db.flush();return t
    def get_refresh_token(self,jti:UUID):return self.db.scalar(select(RefreshToken).where(RefreshToken.jti==jti))
    def revoke_refresh_token(self,jti:UUID):
        t=self.get_refresh_token(jti)
        if t is None or t.revoked_at is not None:return False
        t.revoked_at=datetime.now(UTC);self.db.flush();return True
