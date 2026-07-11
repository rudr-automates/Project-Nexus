#!/usr/bin/env bash

source "$(dirname "$0")/functions.sh"

print_header "Docker Infrastructure Status"

run_compose ps