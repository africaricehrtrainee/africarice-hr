#!/bin/bash

# Define the repository and branch
REPO_PATH=".."
BRANCH="main"

# Define Docker Compose command
DOCKER_COMPOSE_CMD="docker-compose"

# Navigate to the repository
cd $REPO_PATH || exit

# Fetch the latest changes from the remote repository
git fetch origin $BRANCH

# Check if there are any new commits
LOCAL=$(git rev-parse $BRANCH)
REMOTE=$(git rev-parse origin/$BRANCH)

if [ $LOCAL != $REMOTE ]; then
  echo "New commit detected. Deploying new changes..."

  # Pull the latest changes
  git pull origin $BRANCH

  # Bring down the Docker Compose services
  $DOCKER_COMPOSE_CMD down

  # Bring up the Docker Compose services with a build
  $DOCKER_COMPOSE_CMD up --build -d

  echo "Deployment completed."
else
  echo "No new commits. Everything is up-to-date."
fi