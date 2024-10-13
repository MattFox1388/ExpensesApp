import json
import pytest


@pytest.fixture
def login_payload():
    return {
        "username": "kazou1388",
        "password": "g!antMint26",
    }

@pytest.fixture
def create_user_input():
    return {
        "username": "test_user_1",
        "password": "abn123!",
    }


def test_login(test_client, login_payload):
    response = test_client.post(
        '/login', data=login_payload
    )

    assert response.status_code == 200
    response_json = json.loads(response.data)
    assert 'token' in response_json
    assert len(response_json['token']) > 5

def test_create_user(test_client, create_user_input):
    response = test_client.put(
        '/users', data=create_user_input
    )

    assert response.status_code == 200

    response_login = test_client.post(
        '/login', data=create_user_input
    )

    assert response_login.status_code == 200
    response_json = json.loads(response_login.data)
    assert 'token' in response_json
    assert len(response_json['token']) > 5
