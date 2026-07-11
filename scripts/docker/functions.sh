#!/usr/bin/env bash

################################################################################
# Shared Docker Functions
################################################################################

source "$(dirname "${BASH_SOURCE[0]}")/config.sh"

################################################################################
# Output Helpers
################################################################################

print_header() {
    echo
    echo "========================================"
    echo "        PROJECT NEXUS TOOLKIT"
    echo "========================================"
    echo
    echo "$1"
    echo
}

print_success() {
    echo
    echo "========================================"
    echo "✔ $1"
    echo "========================================"
    echo
}

print_error() {
    echo
    echo "========================================"
    echo "✖ ERROR: $1"
    echo "========================================"
    echo
}

################################################################################
# Docker Compose Wrapper
################################################################################

run_compose() {

    local compose_args=(
        --env-file "$ENV_FILE"
        -f "$COMPOSE_FILE"
    )

    ###########################################################################
    # Automatically load every override compose file
    ###########################################################################

    if [ -d "$COMPOSE_DIR/overrides" ]; then

        while IFS= read -r file
        do
            compose_args+=(-f "$file")
        done < <(
            find "$COMPOSE_DIR/overrides" \
                -maxdepth 1 \
                -name "*.yaml" \
                | sort
        )

    fi

    docker compose \
        "${compose_args[@]}" \
        "$@"
}