#!/usr/bin/env bash

###############################################################################
# Shared Docker Functions
###############################################################################

source "$(dirname "${BASH_SOURCE[0]}")/config.sh"

run_compose() {
    docker compose \
        --env-file "$ENV_FILE" \
        -f "$COMPOSE_FILE" \
        "$@"
}