FROM python:3.10

RUN apt-get update && apt-get install -y vim curl sqlite3

# install poetry to manage python package
RUN curl -sSL https://install.python-poetry.org | python3 -
RUN $HOME/.local/bin/poetry config virtualenvs.create false 

WORKDIR /app
COPY ./data/app.db /app/data/app.db 
COPY ./pyproject.toml /app/pyproject.toml
COPY ./stock /app/stock

RUN $HOME/.local/bin/poetry install --only main
# RUN $HOME/.local/bin/poetry shell


# CMD ["/root/.local/bin/poetry", "shell"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# If running behind a proxy like Nginx or Traefik add --proxy-headers
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--proxy-headers"]

