# Use official Python lightweight image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory for local static files
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Expose port
EXPOSE 8000

# Run FastAPI with Gunicorn (Uvicorn workers)
CMD ["gunicorn", "backend.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
