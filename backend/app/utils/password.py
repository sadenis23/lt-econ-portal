import re
import hashlib
import base64
from typing import Dict, Any

def validate_password(password: str) -> Dict[str, Any]:
    """
    Validate password strength according to NIST SP 800-63B guidelines
    """
    errors = []
    
    # Minimum length check
    if len(password) < 12:
        errors.append("Password must be at least 12 characters long")
    
    # Character variety checks
    if not re.search(r"[A-Z]", password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r"[a-z]", password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r"\d", password):
        errors.append("Password must contain at least one number")
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        errors.append("Password must contain at least one special character")
    
    # Check for common patterns
    common_patterns = [
        "password", "123456", "qwerty", "admin", "user",
        "letmein", "welcome", "monkey", "dragon", "master"
    ]
    
    password_lower = password.lower()
    for pattern in common_patterns:
        if pattern in password_lower:
            errors.append("Password contains common patterns that are not allowed")
            break
    
    # Check for sequential characters
    if re.search(r"(.)\1{2,}", password):
        errors.append("Password contains repeated characters")
    
    # Check for keyboard sequences
    keyboard_sequences = [
        "qwerty", "asdfgh", "zxcvbn", "123456", "abcdef"
    ]
    for seq in keyboard_sequences:
        if seq in password_lower:
            errors.append("Password contains keyboard sequences")
            break
    
    # Simple entropy check (basic implementation)
    unique_chars = len(set(password))
    if unique_chars < 8:
        errors.append("Password has insufficient character variety")
    
    if errors:
        return {
            "valid": False,
            "errors": errors,
            "score": 0
        }
    
    # Calculate basic strength score
    score = 0
    if len(password) >= 12:
        score += 1
    if len(password) >= 16:
        score += 1
    if re.search(r"[A-Z]", password) and re.search(r"[a-z]", password):
        score += 1
    if re.search(r"\d", password):
        score += 1
    if re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        score += 1
    if unique_chars >= 10:
        score += 1
    
    return {
        "valid": True,
        "score": score,
        "strength": "weak" if score < 3 else "medium" if score < 5 else "strong"
    }

def hash_password_for_bcrypt(password: str) -> str:
    """
    Hash password with SHA-256 before bcrypt to handle long passwords
    bcrypt has a 72-character limit, so we hash longer passwords
    """
    if len(password) <= 72:
        return password
    
    # Hash with SHA-256 and encode as base64
    hash_obj = hashlib.sha256(password.encode('utf-8'))
    return base64.b64encode(hash_obj.digest()).decode('utf-8') 