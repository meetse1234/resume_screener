FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libffi-dev \
    libsndfile1 \
    git \
    && apt-get clean

# Set work directory
WORKDIR /app

# Copy your project files
COPY . .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose the port Flask runs on
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
