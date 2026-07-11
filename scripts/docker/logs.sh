#!/usr/bin/env bash

source "$(dirname "$0")/functions.sh"

print_header "Docker Logs"

run_compose logs -f