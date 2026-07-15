#!/usr/bin/env bash

################################################################################
# Project Nexus Doctor
################################################################################

source "$(dirname "$0")/functions.sh"

print_header "Project Nexus Doctor"

echo "Running health checks..."
echo

check() {
    local name="$1"
    local command="$2"

    if eval "$command" >/dev/null 2>&1; then
        printf "✔ %-35s OK\n" "$name"
    else
        printf "✖ %-35s FAILED\n" "$name"
    fi
}

###############################################################################
# Docker
###############################################################################

check "Docker Engine" \
"docker info"

check "Docker Compose" \
"docker compose version"

###############################################################################
# Required Files
###############################################################################

check ".env file" \
"[ -f \"$ENV_FILE\" ]"

check "compose.yaml" \
"[ -f \"$COMPOSE_FILE\" ]"

###############################################################################
# Containers
###############################################################################

check "PostgreSQL Container" \
"docker ps --format '{{.Names}}' | grep -qx project-nexus-postgres"

check "n8n Container" \
"docker ps --format '{{.Names}}' | grep -qx project-nexus-n8n"

check "Browserless Container" \
"docker ps --format '{{.Names}}' | grep -qx project-nexus-browserless"

check "Cloudflared Container" \
"docker ps --format '{{.Names}}' | grep -qx project-nexus-cloudflared"

###############################################################################
# Docker Network
###############################################################################

check "Docker Network" \
"docker network inspect project-nexus_nexus-network"

###############################################################################
# Docker Volumes
###############################################################################

check "PostgreSQL Volume" \
"docker volume inspect project-nexus_postgres-data"

check "n8n Volume" \
"docker volume inspect project-nexus_n8n-data"

###############################################################################
# Overall
###############################################################################

echo
echo "========================================"

if docker info >/dev/null 2>&1 \
&& docker network inspect project-nexus_nexus-network >/dev/null 2>&1 \
&& docker volume inspect project-nexus_postgres-data >/dev/null 2>&1 \
&& docker volume inspect project-nexus_n8n-data >/dev/null 2>&1
then
    echo "✔ Project Nexus Infrastructure Healthy"
else
    echo "✖ Project Nexus Infrastructure Needs Attention"
fi

echo "========================================"
echo