#!/bin/bash

cd "$(dirname "$0")"

TARGET_DIR="/var/www/vhosts/exoface.bbzwinf.ch/httpdocs/build"

npm install
npm run build

rm -rf "${TARGET_DIR}"
mkdir "$TARGET_DIR"
mv dist/* "$TARGET_DIR"/
rm -rf dist

echo "Deployment finished"