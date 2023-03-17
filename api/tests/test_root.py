from fastapi.testclient import TestClient

from stock.main import app

client: TestClient = TestClient(app)


def test_root():
    resp = client.get("/")
    json = resp.json()
    assert json["message"] == "This is the STOCK API"


def test_health():
    resp = client.get("/health")
    json = resp.json()
    assert json["name"] == "Stock API"
