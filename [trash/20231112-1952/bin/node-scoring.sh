#!/bin/sh

# Get the directory path of the script
script_dir=$(dirname "$0")

# Change the current working directory to the script's location
cd "$script_dir"

node ../app/scoring.js "$1"
