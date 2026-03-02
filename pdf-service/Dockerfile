FROM python:3.12-slim

LABEL maintainer="clear-rents"
LABEL description="SF-86 PDF microservice - FastAPI + PyMuPDF"

WORKDIR /app

# Install system dependencies required by PyMuPDF
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libgl1 \
        libglib2.0-0 && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create templates directory if not present
RUN mkdir -p /app/templates

EXPOSE 8001

# Run with uvicorn. Workers can be scaled via environment variable.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--log-level", "info"]
