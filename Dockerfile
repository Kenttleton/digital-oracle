# Multi-stage build
# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

# Copy frontend files
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend
FROM python:3.13-slim

WORKDIR /app

RUN pip install pipenv
# Install dependencies
COPY Pipfile Pipfile.lock ./
ENV PIPENV_VENV_IN_PROJECT=1
RUN pipenv install --deploy --system --dev

ENV PATH="/.venv/bin:$PATH"

# Copy application
COPY *.py .

# Copy built frontend from stage 1
COPY --from=frontend-builder /static /app/static

# Expose port
EXPOSE 8000

# Run the application
CMD ["pipenv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]