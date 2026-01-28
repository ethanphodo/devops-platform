#!/bin/bash

# Deployment Script for DevOps Platform
# This script will be expanded as you learn AWS in your bootcamp

set -e  # Exit on any error

echo "=========================================="
echo "DevOps Platform Deployment Script"
echo "=========================================="

# Configuration
DOCKER_IMAGE="devops-platform"
DOCKER_TAG="${1:-latest}"

echo "Deploying image: ${DOCKER_IMAGE}:${DOCKER_TAG}"

# Step 1: Verify the image exists
if ! docker image inspect ${DOCKER_IMAGE}:${DOCKER_TAG} > /dev/null 2>&1; then
    echo "Error: Image ${DOCKER_IMAGE}:${DOCKER_TAG} not found"
    exit 1
fi

# Step 2: Stop existing container if running
if docker ps -q -f name=devops-platform-prod > /dev/null 2>&1; then
    echo "Stopping existing container..."
    docker stop devops-platform-prod || true
    docker rm devops-platform-prod || true
fi

# Step 3: Run new container
echo "Starting new container..."
docker run -d \
    --name devops-platform-prod \
    -p 3000:3000 \
    --restart unless-stopped \
    -e NODE_ENV=production \
    ${DOCKER_IMAGE}:${DOCKER_TAG}

# Step 4: Health check
echo "Waiting for container to be healthy..."
sleep 5

if curl --fail http://localhost:3000/health > /dev/null 2>&1; then
    echo "✓ Deployment successful! Application is healthy."
    echo "  Access at: http://localhost:3000"
else
    echo "✗ Deployment failed! Health check did not pass."
    docker logs devops-platform-prod
    exit 1
fi

# Future: Add AWS deployment steps here
# - Push to ECR
# - Update ECS service
# - Or deploy to EC2 via SSH

echo "=========================================="
echo "Deployment Complete"
echo "=========================================="
