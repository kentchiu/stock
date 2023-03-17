from fastapi.testclient import TestClient

from stock.main import app

client: TestClient = TestClient(app)


def test_list_gains():
    resp = client.get("/gains")
    json = resp.json()
    assert json == []


def test_list_gains_with_symbols():
    resp = client.get("/gains?symbols=AAPL,TSLA")
    json = resp.json()
    print(json)
    assert json[0]["symbol"] is not None
    assert json[0]["quoteDate"] is not None
    assert json[0]["price"] is not None
    assert json[0]["shares"] is not None
    assert json[0]["marketValue"] is not None
    assert json[0]["change"] is not None
    assert json[0]["changePercent"] is not None
    assert json[0]["dailyGain"] is not None
    assert json[0]["dailyGainPercent"] is not None
    assert json[0]["totalGain"] is not None
    assert json[0]["totalGainPercent"] is not None
    # assert json[0]["trades"] is not None
    # assert json[0]["trades"][0]["tradeId"] is not None
    # assert json[0]["trades"][0]["note"] is not None


def test_list_gains_without_symbol():
    resp = client.get("/gains")
    json = resp.json()
    assert json == []


def test_total_gains():
    resp = client.get("/gains/total")

    json = resp.json()
    assert json["marketValue"] is not None
    assert json["realized"] is not None
    assert json["unrealized"] is not None
    assert json["dailyGain"] is not None
    assert json["dailyGainPercent"] is not None
    assert json["totalGain"] is not None
    assert json["totalGainPercent"] is not None
