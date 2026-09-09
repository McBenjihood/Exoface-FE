#!/bin/bash

PROJECT_DIR="/httpdocs"
DEPLOY_DIR="/httpdocs/build"

cd "$PROJECT_DIR"
mkdir "$DEPLOY_DIR"

echo "Installing dependencies..."
npm i

echo "Building..."
npm run build

echo "Deploying..."
rm -rf "$DEPLOY_DIR"/*
mv -r dist/* "$DEPLOY_DIR"/
rm -rf "$PROJECT_DIR"/dist

echo "Deployment complete."