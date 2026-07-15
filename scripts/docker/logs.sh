#!/usr/bin/env bash

################################################################################
# Project Nexus
# Docker Logs
################################################################################

source "$(dirname "$0")/functions.sh"

SERVICE="$1"

if [ -z "$SERVICE" ]; then
    print_header "Project Nexus Logs (All Services)"
    run_compose logs -f
    exit 0
fi

case "$SERVICE" in
    postgres|n8n|browserless|cloudflared)
        print_header "Project Nexus Logs ($SERVICE)"
        run_compose logs -f "$SERVICE"
        ;;
    *)
        echo
        echo "Unknown service: $SERVICE"
        echo
        echo "Available services:"
        echo "  postgres"
        echo "  n8n"
        echo "  browserless"
        echo "  cloudflared"
        echo
        exit 1
        ;;
esac