import requests
import uuid
import time

BASE_URL = "http://localhost:8000/api"

def run_tests():
    print("=== Testing Week 6 Authentication & Security ===\n")
    email = f"test.farmer.{uuid.uuid4().hex[:6]}@example.com"
    password = "securepassword123"
    name = "Rajesh Kumar"

    # 1. Validation test: Invalid email
    print("1. Testing Registration Input Validation (Invalid Email)...")
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": name,
        "email": "invalid-email-format",
        "password": password
    })
    print(f"Status: {res.status_code}, Body: {res.json()}")
    assert res.status_code == 400, "Should return 400 for invalid email"
    print("Pass!\n")

    # 2. Validation test: Password too short
    print("2. Testing Registration Input Validation (Password too short)...")
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": name,
        "email": email,
        "password": "short"
    })
    print(f"Status: {res.status_code}, Body: {res.json()}")
    assert res.status_code == 400, "Should return 400 for short password"
    print("Pass!\n")

    # 3. Successful Registration
    print("3. Testing Successful User Registration...")
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": name,
        "email": email,
        "password": password
    })
    print(f"Status: {res.status_code}, Body: {res.json()}")
    assert res.status_code == 201, "Should return 201 Created"
    user_data = res.json()
    assert user_data["name"] == name
    assert user_data["email"] == email
    assert "hashed_password" not in user_data, "Should not return hashed_password in response"
    print("Pass!\n")

    # 4. Duplicate email check
    print("4. Testing Duplicate Email Registry...")
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": name,
        "email": email,
        "password": password
    })
    print(f"Status: {res.status_code}, Body: {res.json()}")
    assert res.status_code == 400, "Should return 400 Bad Request"
    print("Pass!\n")

    # 5. Successful Login
    print("5. Testing User Login & JWT Token Generation...")
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    print(f"Status: {res.status_code}, Body: {res.json()}")
    assert res.status_code == 200, "Should return 200 OK"
    token_data = res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    token = token_data["access_token"]
    print("Pass!\n")

    # 6. Protected endpoint: Request without token
    print("6. Testing Protected API /auth/me (Missing Token)...")
    res = requests.get(f"{BASE_URL}/auth/me")
    print(f"Status: {res.status_code}, Body: {res.json()}")
    assert res.status_code == 401, "Should return 401 Unauthorized"
    print("Pass!\n")

    # 7. Protected endpoint: Request with invalid token
    print("7. Testing Protected API /auth/me (Invalid Token)...")
    res = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": "Bearer invalid_token"})
    print(f"Status: {res.status_code}, Body: {res.json()}")
    assert res.status_code == 401, "Should return 401 Unauthorized"
    print("Pass!\n")

    # 8. Protected endpoint: Request with valid token
    print("8. Testing Protected API /auth/me (Valid Token)...")
    res = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token}"})
    print(f"Status: {res.status_code}, Body: {res.json()}")
    assert res.status_code == 200, "Should return 200 OK"
    profile_data = res.json()
    assert profile_data["email"] == email
    assert profile_data["name"] == name
    print("Pass!\n")

    # 9. Rate limiting check (SlowAPI)
    print("9. Testing Rate Limiting on Login (5 requests/15m limit)...")
    # We already sent 1 login request. Let's send 5 more to exceed the rate limit of 5.
    exceeded = False
    for i in range(10):
        res = requests.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": password
        })
        print(f"Request {i+2} Status: {res.status_code}")
        if res.status_code == 429:
            exceeded = True
            print(f"Rate limited successfully at request {i+2}! Body: {res.json()}")
            break
        time.sleep(0.1)
    assert exceeded, "Should have been rate limited with status 429"
    print("Pass!\n")

    print("All tests passed successfully!")

if __name__ == "__main__":
    run_tests()
