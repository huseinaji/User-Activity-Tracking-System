# User Activity Tracking System

Scalable API usage tracking system for high-traffic environments. Built with **TypeScript** (NestJS) implementation.

## Features
- **Endpoints**: `/api/register` (POST), `/api/logs` (POST), `/api/usage/daily` (GET), `/api/usage/top` (GET)
- **Auth**: API Key + JWT
- **Caching**: Redis (1h TTL, versioning, pre-warming) + local LRU fallback
- **Database**: PostgreSQL
- **Concurrency**: Atomic Redis `INCRBY`, batch logging
- **Security**: AES-256-GCM, rate limiting (1000 req/h)
- **Resilience**: Retry logic, circuit breaker, graceful degradation
- **Docs**: Swagger UI at `/docs/`
- **Setup**: Dockerfile + docker-compose

## Setup
```bash
git clone https://github.com/yourusername/activity-tracker.git
cd activity-tracker
docker compose up --build