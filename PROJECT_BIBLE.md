# Project Nexus Bible

> "Infrastructure first. Automation forever."

---

# Mission

Project Nexus is a long-term self-hosted automation platform built to support AI, workflow orchestration, browser automation, integrations, databases, monitoring, and future intelligent services.

The objective is not merely to run n8n.

The objective is to build infrastructure that can continuously evolve without requiring architectural redesign.

---

# Philosophy

Every decision made in this repository should follow these principles.

## 1. Configuration over Hardcoding

Nothing should be hardcoded if it may reasonably change in the future.

Configuration belongs in:

- .env
- Docker Compose
- Environment variables
- Configuration files

Never inside application logic unless absolutely required.

---

## 2. Infrastructure Before Workflows

Workflows depend on infrastructure.

Infrastructure should never depend on workflows.

Build the platform first.

Then build automation.

---

## 3. One Responsibility Per Service

Every container should have a single purpose.

Examples:

- n8n → Workflow engine
- PostgreSQL → Database
- Ollama → AI inference
- Browser container → Automation
- Monitoring stack → Observability

Avoid "Swiss Army Knife" containers.

---

## 4. Reproducibility

The complete platform should be reproducible from Git alone.

A fresh machine should require only:

- Git clone
- Docker
- Docker Compose
- Environment configuration

Everything else should be created automatically.

---

## 5. Security by Default

Secrets never belong inside repositories.

Sensitive values belong in:

- .env
- Docker Secrets (future)
- Secret managers (future)

Never commit credentials.

---

## 6. Documentation Is Code

If infrastructure changes:

Documentation changes.

Every architectural decision should have documentation.

---

## 7. Modular Design

Every future service should integrate without restructuring the repository.

Examples:

- AI
- Monitoring
- Browser automation
- Message queues
- APIs
- Databases

New services should plug into existing architecture.

---

## 8. Version Controlled Infrastructure

Infrastructure is source code.

Compose files

Environment templates

Scripts

Configuration

Everything belongs in Git.

---

## 9. Keep It Replaceable

Every technology choice should be replaceable.

Today:

Docker Compose

Tomorrow:

Kubernetes

Infrastructure should minimize vendor lock-in.

---

## 10. Build Once. Improve Forever.

Never optimize for quick hacks.

Always optimize for long-term maintainability.

Future development should extend the platform—not rebuild it.

---

# Engineering Standards

Before adding anything, ask:

- Does this belong here?
- Can this be configured?
- Can this be reused?
- Is this documented?
- Will this scale?

If the answer is "No", rethink the implementation.

---

# Repository Goal

Project Nexus should eventually become capable of running:

- AI models
- Automation workflows
- Browser automation
- APIs
- Databases
- Monitoring
- Scheduling
- Internal services
- Future applications

without major architectural changes.

---

# Motto

Build foundations once.

Build automations forever.