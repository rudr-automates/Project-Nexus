# Project Nexus Architecture

> **The technical blueprint of the Project Nexus platform**

---

# Purpose

Project Nexus is a self-hosted intelligent automation platform designed to provide reusable infrastructure and shared services for automation applications.

Rather than being a single automation workflow, Project Nexus serves as the foundation upon which multiple applications can be built, deployed, and operated.

The platform provides common capabilities such as infrastructure, networking, browser automation, AI runtimes, storage, monitoring, and developer tooling.

Applications consume these capabilities instead of implementing them independently.

---

# Architectural Philosophy

Project Nexus follows one fundamental principle:

> **Build platforms, not projects.**

Every engineering decision should improve the platform as a whole rather than solving a single application's immediate needs.

This philosophy allows future automation projects to inherit existing capabilities while remaining independent of one another.

---

# Platform Overview

```text
                           Project Nexus
                                  │
    ┌─────────────────────────────┼─────────────────────────────┐
    │                             │                             │
Infrastructure               Shared Services            Automation Runtime
    │                             │                             │
Networking                  Browser Runtime              AI Runtime
Storage                     Monitoring                   Security
Documentation               Developer Toolkit            Logging
                                  │
                                  ▼
                           Applications
                                  │
                           Project Lynx
```

Project Nexus owns the platform.

Applications own business logic.

This separation must remain clear throughout the lifetime of the project.

---

# Platform Layers

## Infrastructure

Responsible for providing the physical runtime of the platform.

Current responsibilities include:

- Docker
- Docker Compose
- Persistent volumes
- PostgreSQL
- Environment configuration

Future responsibilities may include:

- Redis
- Object storage
- Reverse proxies
- Additional databases

Infrastructure should remain modular and reproducible.

---

## Networking

Responsible for secure communication between services and external users.

Current technologies:

- Cloudflare Tunnel
- Internal Docker network

Responsibilities:

- Secure HTTPS access
- DNS
- Tunnel management
- Service discovery

Networking should never contain application logic.

---

## Automation Runtime

The Automation Runtime executes automation workloads.

Responsibilities include:

- n8n
- Browser automation
- Workflow execution
- Scheduling
- Secrets
- File handling

This layer represents the operational heart of Project Nexus.

Applications submit work to the runtime.

The runtime should not contain business-specific logic.

---

## Shared Services

Shared services provide reusable functionality across applications.

Examples include:

- Browser runtime
- Monitoring
- Logging
- Notifications
- Authentication
- Shared storage
- Utility services

Every new shared service should be reusable by multiple applications whenever practical.

---

## AI Runtime

Artificial Intelligence is considered a platform capability rather than the platform itself.

Future responsibilities include:

- Ollama
- Open WebUI
- Local language models
- Embeddings
- Vector databases
- AI orchestration

Applications should remain functional without AI whenever practical.

AI enhances workflows rather than replacing engineering.

---

# Applications

Applications are independent systems built on top of Project Nexus.

Applications should never duplicate platform functionality.

Instead, they consume shared platform services.

Current application:

- Project Lynx

Future applications may include:

- Project Orion
- Project Atlas
- Other automation systems

Applications may evolve independently of the platform.

---

# Project Lynx

Project Lynx is the first production application running on Project Nexus.

Its objective is to automate business discovery and outreach.

High-level workflow:

```text
Business Discovery
        │
Website Analysis
        │
Contact Discovery
        │
Lead Qualification
        │
Google Sheets
        │
Outreach
        │
CRM
```

Project Lynx focuses entirely on business logic.

Infrastructure remains the responsibility of Project Nexus.

---

# Repository Responsibilities

| Directory | Responsibility |
|-----------|----------------|
| docs | Documentation |
| infrastructure | Platform infrastructure |
| services | Platform services |
| scripts | Operational tooling |
| backups | Recovery assets |
| local-files | Local persistent assets |

Future additions:

| Directory | Responsibility |
|-----------|----------------|
| apps | Platform applications |
| shared | Shared libraries and utilities |

These additions will be introduced only when required.

---

# Architectural Boundaries

The following rules define architectural ownership.

## Project Nexus owns

- Infrastructure
- Networking
- Runtime
- Browser services
- AI runtime
- Monitoring
- Security
- Documentation
- Shared tooling

---

## Applications own

- Business workflows
- Automation logic
- Domain-specific configuration
- Business rules
- Reports
- Customer-facing behavior

---

# Design Principles

Project Nexus follows these principles.

1. Platform before applications.

2. Automation before AI.

3. Docker-first deployment.

4. Self-hosted whenever practical.

5. Infrastructure must be reproducible.

6. Documentation is part of the product.

7. Prefer modular services.

8. Prefer simple solutions over clever solutions.

9. Build for long-term maintainability.

10. Every milestone should leave the repository in a deployable state.

---

# Future Growth

Project Nexus is intentionally designed for expansion.

Future capabilities include:

- Local AI ecosystem
- Browser clusters
- Distributed workers
- Agent orchestration
- Shared memory
- Monitoring dashboards
- Centralized logging
- Additional automation applications

These additions should integrate into existing platform layers rather than introducing new architectural paradigms.

---

# Source of Truth

This document defines the official architecture of Project Nexus.

Future engineering decisions should remain consistent with this architecture unless an intentional architectural revision is approved.