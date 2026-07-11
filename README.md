# Project Nexus

> **A Self-Hosted Intelligent Automation Platform**

Project Nexus is a self-hosted intelligent automation platform designed to provide a production-grade foundation for building, operating, and scaling automation systems.

Rather than being a single application, Project Nexus serves as a reusable platform that provides infrastructure, networking, browser automation, AI runtimes, storage, monitoring, security, and developer tooling for multiple automation projects.

The first application built on Project Nexus is **Project Lynx**, an AI-assisted Lead Intelligence Engine focused on discovering businesses, auditing websites, qualifying opportunities, and preparing personalized outreach.

---

# Vision

Project Nexus exists to eliminate repetitive engineering work when building automation systems.

Instead of rebuilding infrastructure for every new project, the platform provides reusable services that can be shared across multiple automation applications.

The long-term objective is to create a modular ecosystem where new automation projects inherit common capabilities rather than reimplementing them.

---

# Core Principles

Project Nexus follows several engineering principles:

- Platform before applications
- Automation before AI
- Docker-first architecture
- Self-hosted whenever practical
- Modular and reusable services
- Documentation as part of the product
- Infrastructure should always be reproducible
- Prefer simplicity over unnecessary complexity

---

# Platform Architecture

```text
                    Project Nexus
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
Infrastructure        Shared Services        Automation Runtime
    │                      │                      │
Networking          Browser Runtime          AI Runtime
Storage             Monitoring               Security
Documentation       Developer Toolkit        Logging
                           │
                           ▼
                     Applications
                           │
                     Project Lynx
```

Project Nexus is the platform.

Project Lynx is the first application built on top of that platform.

Future applications will reuse the same shared infrastructure.

---

# Current Repository Structure

```text
Project-Nexus/

├── docs/
├── infrastructure/
├── services/
├── scripts/
├── backups/
├── local-files/
│
├── .env
├── README.md
├── PROJECT_BIBLE.md
└── .gitignore
```

---

# Current Development Stage

**Current Milestone**

> Milestone 3 — Automation Runtime

Completed milestones:

- ✅ Foundation
- ✅ Connectivity

Current focus:

- Browser automation
- Shared browser runtime
- Project Lynx integration
- Google Workspace integration
- Workflow execution
- Logging and monitoring
- Production-ready automation services

---

# Technology Stack

Current platform technologies include:

- Docker
- Docker Compose
- n8n
- PostgreSQL
- Cloudflare Tunnel
- Ubuntu (WSL2)
- Git & GitHub

Future additions include:

- Ollama
- Open WebUI
- Playwright
- Browser automation services
- Local AI models
- Monitoring stack

---

# Getting Started

Clone the repository.

Configure the environment variables.

Start the infrastructure using the toolkit scripts.

```bash
./scripts/docker/up.sh
```

The platform can then be managed using the additional toolkit scripts located in:

```text
scripts/docker/
```

---

# Documentation

Project documentation is organized into dedicated sections.

| Document | Purpose |
|----------|---------|
| PROJECT_BIBLE.md | Vision, governance and engineering principles |
| Architecture | Platform design and technical decisions |
| Roadmap | Development milestones |
| Development Rules | Engineering standards |
| Recovery | Disaster recovery and rebuild process |
| AI Documentation | AI continuity and handoff |

---

# License

This project is currently maintained as a private engineering platform.

Licensing terms will be defined before the first public release.

---

## Status

🚧 **Under Active Development**

Project Nexus is currently progressing through **Milestone 3 — Automation Runtime**, where the platform is evolving from a stable infrastructure into a production-ready intelligent automation environment.