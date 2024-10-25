"""Seed Database

Revision ID: 00d94264d14d
Revises: 2db4fb62d189
Create Date: 2024-10-24 11:34:31.181419

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '00d94264d14d'
down_revision: Union[str, None] = '2db4fb62d189'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    connection = op.get_bind()

    # Autoload the table schema from the database using the connection
    category_table = sa.Table('category', sa.MetaData(), autoload_with=connection)
    month_table = sa.Table('month', sa.MetaData(), autoload_with=connection)
    user_table = sa.Table('user', sa.MetaData(), autoload_with=connection)

    # Perform bulk insert
    op.bulk_insert(category_table, [
        {'id': 1, 'cat_type': 'NEEDS'},
        {'id': 2, 'cat_type': 'WANTS'},
        {'id': 3, 'cat_type': 'SAVINGS'},
        {'id': 4, 'cat_type': 'PAYCHECK'},
        {'id': 5, 'cat_type': 'INTEREST'},
    ])

    op.bulk_insert(month_table, [
        {'id': 1, 'month_name': 'JAN'},
        {'id': 2, 'month_name': 'FEB'},
        {'id': 3, 'month_name': 'MAR'},
        {'id': 4, 'month_name': 'APR'},
        {'id': 5, 'month_name': 'MAY'},
        {'id': 6, 'month_name': 'JUN'},
        {'id': 7, 'month_name': 'JUL'},
        {'id': 8, 'month_name': 'AUG'},
        {'id': 9, 'month_name': 'SEP'},
        {'id': 10, 'month_name': 'OCT'},
        {'id': 11, 'month_name': 'NOV'},
        {'id': 12, 'month_name': 'DEC'},
    ])

    op.bulk_insert(user_table, [
        {'id': 1, 'username': 'kazou1388', 'password_hash': '$6$rounds=656000$gGRjoZcVeBd9YpQi$rV6WQQfLXPOWPGNDAM7naLXDfdx7FU/kcxv3d39xhmyHtCYyc5U783iRZFTPASzzDFT9JFUABq/gRLHzdfs5l.'}
    ])


def downgrade() -> None:
    op.execute('DELETE FROM category')
    op.execute('DELETE FROM month')
    op.execute('DELETE FROM user')
