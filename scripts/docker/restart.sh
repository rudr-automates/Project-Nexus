#!/usr/bin/env bash

source "$(dirname "$0")/functions.sh"

print_header "Restarting Infrastructure"

run_compose down

run_compose up -d

print_success