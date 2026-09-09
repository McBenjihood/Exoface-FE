#!/bin/bash

PROJECT_DIR="/httpdocs"
DEPLOY_DIR="/httpdocs/public"

echo "current directory" > DEPLOY.log
echo "project dir" >> $PROJECT_DIR/DEPLOY.log
echo "deploy dir" >> $DEPLOY_DIR/DEPLOY.log

cd "$PROJECT_DIR"
mkdir "$DEPLOY_DIR"

echo "Installing dependencies..."
npm i

echo "Building..."
npm run build

echo "Deploying..."
rm -rf "$DEPLOY_DIR"/*
cp -r dist/* "$DEPLOY_DIR"/

echo "Deployment complete."