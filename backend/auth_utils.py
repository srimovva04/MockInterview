import jwt
from flask import request
from functools import wraps
import os


SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")


def verify_token(token):
    try:
        decoded = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"error": "Missing or invalid token"}, 401
        token = auth_header.split(" ")[1]
        user = verify_token(token)
        if not user:
            return {"error": "Invalid or expired token"}, 401
        return f(*args, **kwargs)
    return decorated_function
