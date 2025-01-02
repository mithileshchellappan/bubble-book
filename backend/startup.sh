#!/bin/bash
cd /home/site/wwwroot
echo "Current directory: $(pwd)"

echo "Installing dependencies..."
npm install --production --no-optional

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Installing PM2 globally..."
    npm install -g pm2
else
    echo "PM2 is already installed"
fi

echo "Starting/Restarting application with PM2..."
pm2 restart ecosystem.config.cjs
pm2 save
pm2 logs 