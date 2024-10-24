import time
from typing import Tuple

import jwt
from flask import request

from shared.exceptions import BearerTokenExpiredException


def is_token_valid(secret_key) -> Tuple[bool, object]:
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return False, {'message': 'Missing bearer token'}
    try:
        token = auth_header.split(" ")[1]
        token_obj = jwt.decode(token, secret_key, algorithms='HS256')
        is_token_expired(token_obj)
    except BearerTokenExpiredException as be:
        return False, {'message': be.message}
    except:
        return False, {'message': 'Invalid bearer token'}
    return True, {}

def is_token_expired(token_obj: dict[str, any]):
    expiration_timestamp = token_obj['exp']
    curr_timestamp = time.time()
    if curr_timestamp > expiration_timestamp:
        raise BearerTokenExpiredException("Bearer token is expired.")
