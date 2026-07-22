from collections.abc import Sequence
import sqlalchemy as sa
from alembic import op
revision="20260718_0002";down_revision=None;branch_labels=None;depends_on=None
def upgrade():
    role=sa.Enum("USER","PREMIUM","DIETITIAN","COACH","ADMIN",name="user_role");role.create(op.get_bind(),checkfirst=True)
    op.create_table("users",sa.Column("id",sa.Uuid(),primary_key=True),sa.Column("email",sa.String(320),nullable=False),sa.Column("password_hash",sa.String(512),nullable=False),sa.Column("first_name",sa.String(100),nullable=False),sa.Column("last_name",sa.String(100),nullable=False),sa.Column("role",role,nullable=False),sa.Column("is_active",sa.Boolean(),nullable=False),sa.Column("is_verified",sa.Boolean(),nullable=False),sa.Column("created_at",sa.DateTime(timezone=True),nullable=False),sa.Column("updated_at",sa.DateTime(timezone=True),nullable=False))
    op.create_index("ix_users_email","users",["email"],unique=True);op.create_index("ix_users_email_active","users",["email","is_active"])
    op.create_table("refresh_tokens",sa.Column("id",sa.Uuid(),primary_key=True),sa.Column("jti",sa.Uuid(),nullable=False),sa.Column("user_id",sa.Uuid(),sa.ForeignKey("users.id",ondelete="CASCADE"),nullable=False),sa.Column("expires_at",sa.DateTime(timezone=True),nullable=False),sa.Column("revoked_at",sa.DateTime(timezone=True)),sa.Column("created_at",sa.DateTime(timezone=True),nullable=False))
    op.create_index("ix_refresh_tokens_jti","refresh_tokens",["jti"],unique=True);op.create_index("ix_refresh_tokens_user_id","refresh_tokens",["user_id"]);op.create_index("ix_refresh_tokens_user_active","refresh_tokens",["user_id","revoked_at"])
def downgrade():
    op.drop_table("refresh_tokens");op.drop_table("users");sa.Enum(name="user_role").drop(op.get_bind(),checkfirst=True)

