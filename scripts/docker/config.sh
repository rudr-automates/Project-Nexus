#!/usr/bin/env bash

###############################################################################
# Project Nexus
# Docker Configuration
###############################################################################

# Resolve the project root automatically
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

###############################################################################
# Paths
###############################################################################

COMPOSE_DIR="$PROJECT_ROOT/infrastructure/compose"
COMPOSE_FILE="$COMPOSE_DIR/compose.yaml"
ENV_FILE="$PROJECT_ROOT/.env"

###############################################################################
# Docker Compose command
###############################################################################

DOCKER_COMPOSE="docker compose --env-file $ENV_FILE -f $COMPOSE_FILE"