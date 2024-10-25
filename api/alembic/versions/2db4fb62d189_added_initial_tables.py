"""Added initial tables

Revision ID: 2db4fb62d189
Revises: 
Create Date: 2024-10-24 11:32:30.904180

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2db4fb62d189'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('category',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('cat_type', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('cat_type')
    )
    op.create_table('month',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('month_name', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('month_name')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=32), nullable=True),
    sa.Column('password_hash', sa.String(length=280), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=False)
    op.create_table('month_record',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('year_num', sa.Integer(), nullable=False),
    sa.Column('date_val', sa.Date(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('descr', sa.String(length=255), nullable=False),
    sa.Column('is_positive', sa.Boolean(), nullable=False),
    sa.Column('month_id', sa.Integer(), nullable=True),
    sa.Column('cat_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['cat_id'], ['category.id'], ),
    sa.ForeignKeyConstraint(['month_id'], ['month.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('month_stat',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('year_num', sa.Integer(), nullable=False),
    sa.Column('date_val', sa.Date(), nullable=False),
    sa.Column('paycheck_planned', sa.Float(), nullable=True),
    sa.Column('other_planned', sa.Float(), nullable=True),
    sa.Column('expenses_planned', sa.Float(), nullable=True),
    sa.Column('needs_planned', sa.Float(), nullable=True),
    sa.Column('wants_planned', sa.Float(), nullable=True),
    sa.Column('savings_planned', sa.Float(), nullable=True),
    sa.Column('paycheck_actual', sa.Float(), nullable=True),
    sa.Column('other_actual', sa.Float(), nullable=True),
    sa.Column('expenses_actual', sa.Float(), nullable=True),
    sa.Column('needs_actual', sa.Float(), nullable=True),
    sa.Column('wants_actual', sa.Float(), nullable=True),
    sa.Column('savings_actual', sa.Float(), nullable=True),
    sa.Column('month_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['month_id'], ['month.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('uncategorized_item',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('month_record_id', sa.Integer(), nullable=True),
    sa.Column('is_want_or_expense', sa.Boolean(), nullable=False),
    sa.Column('is_need_want_saving', sa.Boolean(), nullable=False),
    sa.Column('is_should_be_ignored', sa.Boolean(), nullable=False),
    sa.Column('is_expense_or_ignore', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['month_record_id'], ['month_record.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('uncategorized_item')
    op.drop_table('month_stat')
    op.drop_table('month_record')
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_table('user')
    op.drop_table('month')
    op.drop_table('category')
    # ### end Alembic commands ###