#!/bin/bash


PROJECT_DIR="httpdocs/"
DEPLOY_DIR="httpdocs/public"

cd "$PROJECT_DIR"

echo "Installing dependencies..."
npm ci

echo "Building..."
npm run build

echo "Deploying..."
rm -rf "$DEPLOY_DIR"/*
cp -r dist/* "$DEPLOY_DIR"/

echo "Deployment complete."