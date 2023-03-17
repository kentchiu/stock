from fastapi.testclient import TestClient

from stock.main import app

client: TestClient = TestClient(app)


def test_list_quotes_realtime():
    resp = client.get("/quotes?symbols=AAPL,TSLA,MSFT")
    json = resp.json()

    assert json[0]["symbol"] == "AAPL"
    assert json[0]["date"] is not None
    assert json[0]["high"] is not None
    assert json[0]["low"] is not None
    assert json[0]["open"] is not None
    assert json[0]["close"] is not None
    assert json[0]["volume"] is not None

    assert json[1]["symbol"] == "TSLA"
    assert json[2]["symbol"] == "MSFT"
    assert len(json) == 3


def test_list_quotes_realtime_no_symbol():
    resp = client.get("/quotes")
    json = resp.json()
    assert json == []


def test_list_quotes_realtime_single_symbol():
    resp = client.get("/quotes?symbols=AAPL")
    json = resp.json()

    assert json[0]["symbol"] == "AAPL"
    assert json[0]["date"] is not None
    assert json[0]["high"] is not None
    assert json[0]["low"] is not None
    assert json[0]["open"] is not None
    assert json[0]["close"] is not None
    assert json[0]["volume"] is not None
