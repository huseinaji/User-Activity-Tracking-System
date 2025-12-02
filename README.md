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

## Environment Variables (.env)

Create a `.env` file in the root directory with the following variables:

```dotenv
# PostgreSQL Connection
DB_URI=                               # e.g., localhost or postgres (when using docker-compose)
DB_PORT=                              # e.g., 5432
DB_USERNAME=                          # e.g., postgres
DB_PASSWORD=                          # your database password
DB_NAME=                              # e.g., user-activity
DB_DIALECT=postgres                   # fixed: postgres

# Server
PORT=8000                             # application port

# JWT
JWT_SECRET=                           # strong random secret (min 32 characters)

# Redis
REDIS_URI=                            # e.g., redis://localhost:6379 or redis://redis:6379 (docker)

# Optional
WHITELISTED_IP=["127.0.0.1", "192.168.1.0/24", "::1"]   # JSON array string, leave empty to disable
SECRET=                               # additional encryption/hashing secret
```
## Setup
```bash
git clone https://github.com/yourusername/activity-tracker.git
cd activity-tracker
docker compose up --build