"""
cli/create_admin.py — Create an admin user from the command line.

Admin accounts are never created through a web UI or public endpoint.
Only someone with server/local access can run this script.

Usage:
    python -m app.cli.create_admin --name "Sameer" --email "admin@medicode.com" --password "secure-password"

How it works:
1. Accepts name, email, password via CLI args
2. Checks if email already exists → exits with error if so
3. Hashes password with bcrypt (same as regular auth)
4. Inserts user row with role='admin'
5. Prints confirmation
"""

import argparse
import sys

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.services.auth_service import hash_password, get_user_by_email


def create_admin(name: str, email: str, password: str) -> None:
    db: Session = SessionLocal()
    try:
        existing = get_user_by_email(db, email.lower().strip())
        if existing:
            print(f"Error: A user with email '{email}' already exists.")
            sys.exit(1)

        user = User(
            name=name.strip(),
            email=email.lower().strip(),
            password_hash=hash_password(password),
            role="admin",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        print(f"Admin created successfully:")
        print(f"  Name:  {user.name}")
        print(f"  Email: {user.email}")
        print(f"  Role:  {user.role}")
        print(f"  ID:    {user.id}")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create an admin user for MediCode Institute",
    )
    parser.add_argument("--name", required=True, help="Admin's full name")
    parser.add_argument("--email", required=True, help="Admin's email address")
    parser.add_argument("--password", required=True, help="Admin's password")

    args = parser.parse_args()

    if len(args.password) < 8:
        print("Error: Password must be at least 8 characters.")
        sys.exit(1)

    create_admin(args.name, args.email, args.password)


if __name__ == "__main__":
    main()
