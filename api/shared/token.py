from typing import Tuple

import jwt
from flask import request


def is_token_valid(secret_key) -> Tuple[bool, object]:
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return False, {'message': 'Missing token'}
    try:
        token = auth_header.split(" ")[1]
        jwt.decode(token, secret_key, algorithms='HS256')
    except:
        return False, {'message': 'Invalid token'}
    return True, {}