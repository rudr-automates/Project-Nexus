# Recovery Guide

## Purpose

This document describes how to recover Project Nexus after hardware failure, OS reinstall, or repository migration.

---

# Recovery Order

1. Install Docker Desktop
2. Install WSL2
3. Clone repository
4. Restore .env
5. Restore Cloudflare credentials
6. Start Docker infrastructure
7. Verify services
8. Verify HTTPS
9. Restore workflows
10. Resume development

---

# Critical Assets

- .env
- Cloudflare credentials
- Docker volumes
- Git repository
- n8n data
- PostgreSQL data

---

# Verification Checklist

- Docker running
- PostgreSQL healthy
- n8n accessible
- HTTPS working
- Tunnel connected
- Workflows operational

Recovery is complete only after every verification passes.