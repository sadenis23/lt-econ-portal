import time
import json
from fastapi import HTTPException, Request
from typing import Dict, Tuple
import os

# In-memory storage for rate limiting (use Redis in production)
rate_limit_store: Dict[str, Tuple[int, float]] = {}

class RateLimiter:
    def __init__(self, max_attempts: int = 5, window_seconds: int = 300):
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
    
    def is_allowed(self, key: str) -> bool:
        current_time = time.time()
        
        if key in rate_limit_store:
            attempts, window_start = rate_limit_store[key]
            
            # Check if window has expired
            if current_time - window_start > self.window_seconds:
                # Reset window
                rate_limit_store[key] = (1, current_time)
                return True
            
            # Check if limit exceeded
            if attempts >= self.max_attempts:
                return False
            
            # Increment attempts
            rate_limit_store[key] = (attempts + 1, window_start)
            return True
        
        # First attempt
        rate_limit_store[key] = (1, current_time)
        return True
    
    def get_remaining_attempts(self, key: str) -> int:
        if key not in rate_limit_store:
            return self.max_attempts
        
        attempts, window_start = rate_limit_store[key]
        current_time = time.time()
        
        # Check if window has expired
        if current_time - window_start > self.window_seconds:
            return self.max_attempts
        
        return max(0, self.max_attempts - attempts)
    
    def get_reset_time(self, key: str) -> float:
        if key not in rate_limit_store:
            return 0
        
        _, window_start = rate_limit_store[key]
        return window_start + self.window_seconds

# Global rate limiter instances
login_limiter = RateLimiter(max_attempts=5, window_seconds=60)  # 5 attempts per minute for testing
register_limiter = RateLimiter(max_attempts=3, window_seconds=60)  # 3 attempts per minute for testing

def get_client_ip(request: Request) -> str:
    """Get client IP address, handling proxies"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

def rate_limit_login(request: Request):
    """Rate limit login attempts"""
    client_ip = get_client_ip(request)
    key = f"login:{client_ip}"
    
    if not login_limiter.is_allowed(key):
        remaining_time = int(login_limiter.get_reset_time(key) - time.time())
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Too many login attempts",
                "retry_after": remaining_time,
                "message": f"Please try again in {remaining_time} seconds"
            }
        )

def rate_limit_register(request: Request):
    """Rate limit registration attempts"""
    client_ip = get_client_ip(request)
    key = f"register:{client_ip}"
    
    if not register_limiter.is_allowed(key):
        remaining_time = int(register_limiter.get_reset_time(key) - time.time())
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Too many registration attempts",
                "retry_after": remaining_time,
                "message": f"Please try again in {remaining_time} seconds"
            }
        ) 