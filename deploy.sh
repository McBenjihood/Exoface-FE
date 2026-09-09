#!/bin/bash


PROJECT_DIR="./"
DEPLOY_DIR="./public"

cd "$PROJECT_DIR"

echo "Installing dependencies..."
npm ci

echo "Building..."
npm run build

echo "Deploying..."
rm -rf "$DEPLOY_DIR"/*
cp -r dist/* "$DEPLOY_DIR"/

echo "Deployment complete."