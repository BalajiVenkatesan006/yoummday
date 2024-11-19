FROM python:3.10-alpine

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory
WORKDIR /app/backend

# Copy and install requirements
COPY requirements.txt /app/backend/

RUN apk add --virtual .build-deps --no-cache postgresql-dev gcc python3-dev musl-dev && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    apk --purge del .build-deps

# Copy project files
COPY . /app/backend/

COPY wait-for-it.sh /app/backend/

RUN chmod +x /app/backend/wait-for-it.sh

RUN ls -l /app/backend
# Add bash for script execution
RUN apk add --no-cache bash


