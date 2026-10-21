#!/bin/bash

cd "$(dirname "$0")"

TARGET_DIR="../build"

npm install
npm run build

rm -rf "${TARGET_DIR}"/*
mkdir "$TARGET_DIR"
mv dist/* "$TARGET_DIR"/
rmdir dist

echo "Deployment finished"