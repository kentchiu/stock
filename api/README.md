## stock

## TODO

- [] list realize stocks
- [] write trades

## run

```
# 啓動 fastapi app
trade_path=/mnt/d/Dropbox/stock/privacy/trade.csv
uvicorn stock.main:app --reload --port 8888
```

## pytest

```bash
pytest

# test by marker expression (skip mark in this case)
pytest  -m skip 

# test not include yf mark
pytest -m "not yf"

# test single file
pytest ./tests/test_main.py -s -v

# test single function
pytest tests/test_main.py::test_profits_unrealized  -s -v
```

```bash
# test all under current folder

poetry run pytest

# test all file under tests folder
run pytest tests

# test by marker expression (skip mark in this case)
poetry run pytest -m skip

# test not include yf mark
poetry run pytest -m "not yf"
```

## type checked

```bash
poetry run mypy stock/portfolio/services.py
```

## Build And Run

```bash
docker compose build
```

```bash
docker compose up -d
```

## Docker

```bash
docker build -t stock/api -f Dockerfile .
```

```bash
docker run -ti  -p 8000:8000 --mount  type=bind,source=/mnt/d/Dropbox/stock/privacy/trade.csv,target=/code/trades.csv stock/api
```
