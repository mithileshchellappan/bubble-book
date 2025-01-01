#!/bin/bash
cd /home/site/wwwroot
echo "Current directory: $(pwd)"
echo "Installing dependencies..."
npm install --production --no-optional
echo "Starting application..."
PORT=8080 node src/index.js 