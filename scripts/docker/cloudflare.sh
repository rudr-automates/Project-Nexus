#!/bin/bash

source "$(dirname "$0")/functions.sh"

print_header "Starting Cloudflare Tunnel..."

docker compose \
    --env-file .env \
    -f infrastructure/compose/compose.yaml \
    up -d cloudflared

print_success "Cloudflare Tunnel started."