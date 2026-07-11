#!/usr/bin/env bash

###############################################################################
# Project Nexus
# Start Infrastructure
###############################################################################

set -e

source "$(dirname "${BASH_SOURCE[0]}")/functions.sh"

echo
echo "==========================================="
echo "Starting Project Nexus Infrastructure..."
echo "==========================================="
echo

run_compose up -d

echo
echo "==========================================="
echo "Infrastructure started successfully."
echo "==========================================="