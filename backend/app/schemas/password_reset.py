"""
schemas/password_reset.py — Pydantic models for password reset endpoints.

Two request/response pairs:
1. Forgot password: user submits email → gets generic success message
2. Reset password: user submits token + new password → gets success message
"""

from pydantic import BaseModel, EmailStr, Field


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=6)


class ResetPasswordResponse(BaseModel):
    message: str
