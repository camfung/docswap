#!/bin/sh

# Enter the source directory to make sure the script runs where the user expects
cd "/home/site/wwwroot"

rm -rf /home/site/wwwroot/node_modules

# Run npm install, build, and start within the wwwroot directory
npm install && npm run build && npm start