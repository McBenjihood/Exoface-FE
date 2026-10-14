#!/bin/bash
set -e

cd "$(dirname "$0")"

TARGET_DIR="../build"

npm install
npm run build

mkdir -p "$TARGET_DIR"
rm -rf "${TARGET_DIR:?}"/*
mv dist/* "$TARGET_DIR"/
rmdir dist

echo "Deployment finished"