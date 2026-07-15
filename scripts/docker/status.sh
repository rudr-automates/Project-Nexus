#!/usr/bin/env bash

################################################################################
# Project Nexus
# Infrastructure Status Dashboard
################################################################################

source "$(dirname "$0")/functions.sh"

print_header "Project Nexus Infrastructure Status"

echo "==============================================================="
echo "Service              Status"
echo "==============================================================="

check_service() {

    local service="$1"

    local status

    status=$(docker inspect \
        --format='{{.State.Status}}' \
        "project-nexus-$service" 2>/dev/null)

    if [ "$status" = "running" ]; then
        printf "%-20s %s\n" "$service" "RUNNING"
    else
        printf "%-20s %s\n" "$service" "NOT RUNNING"
    fi
}

check_health() {

    local container="$1"

    local health

    health=$(docker inspect \
        --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' \
        "$container" 2>/dev/null)

    if [ "$health" = "healthy" ]; then
        printf "Health Check        HEALTHY\n"
    elif [ "$health" = "starting" ]; then
        printf "Health Check        STARTING\n"
    elif [ "$health" = "unhealthy" ]; then
        printf "Health Check        UNHEALTHY\n"
    fi
}

echo
check_service postgres
check_health project-nexus-postgres

echo
check_service n8n

echo
check_service browserless

echo
check_service cloudflared

echo
echo "==============================================================="
echo

echo "Docker Network"
docker network ls | grep project-nexus >/dev/null \
    && echo "Healthy" \
    || echo "Missing"

echo
echo "Volumes"

docker volume ls | grep postgres-data >/dev/null \
    && echo "PostgreSQL Volume : OK" \
    || echo "PostgreSQL Volume : Missing"

docker volume ls | grep n8n-data >/dev/null \
    && echo "n8n Volume        : OK" \
    || echo "n8n Volume        : Missing"

echo
echo "==============================================================="