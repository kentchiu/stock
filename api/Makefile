# #!/usr/bin/env make -f

.PHONY: dev format test query
PWD := $(shell pwd)


dev:
	. .venv/bin/activate && \
	uvicorn stock.main:app --reload --port 6666 

format:
	. .venv/bin/activate && \
	autoflake -i --remove-all-unused-imports --remove-unused-variab  -r ./stock ./tests &&\
	isort stock && \
	isort tests && \
	black . && \
	mypy stock tests

test:
	. .venv/bin/activate && \
	python -m pytest -v -s

test-debug:
	. .venv/bin/activate && \
	python -m pytest -v -s --log-cli-level=DEBUG

test1:
	. .venv/bin/activate && \
	python -m pytest -v -s --log-cli-level=DEBUG tests/routers/test_trade.py

query:
	sqlite3 -header -column data/app.db 'select * from trade'

docker:
	docker compose build


