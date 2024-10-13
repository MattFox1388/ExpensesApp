from typing import Tuple

import jwt
from flask import request


def is_token_valid(secret_key) -> Tuple[bool, object]:
    token = request.args.get('token')
    if not token:
        return False, {'message': 'Missing token'}
    try:
        jwt.decode(token, secret_key, algorithms='HS256')
    except:
        return False, {'message': 'Invalid token'}
    return True, {}