#!/usr/bin/env bash

source "$(dirname "$0")/functions.sh"

print_header "Stopping Infrastructure"

run_compose down

print_success