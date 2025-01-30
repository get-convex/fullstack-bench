default:
    @just --list

format:
    just format-python

lint:
    just lint-python

format-python:
    pdm run black .

lint-python:
    pdm run ruff check .