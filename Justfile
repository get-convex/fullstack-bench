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

typecheck:
    cd tasks/000-chat_app/project && bunx tsc --noEmit -p .
    cd tasks/001-todo_app/project && bunx tsc --noEmit -p .
    cd tasks/002-files_app/project && bunx tsc --noEmit -p .
    cd templates/convex && bunx tsc --noEmit -p .
    cd templates/supabase && bunx tsc --noEmit -p .