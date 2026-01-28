# DevOps Platform
![CI Pipeline](https://github.com/ethanphodo/devops-platform/actions/workflows/ci.yml/badge.svg)

A demonstration project showcasing CI/CD pipelines, Docker containerization, and infrastructure automation. Built as part of my DevOps learning journey.

**Author:** Ethan Do  
**GitHub:** [github.com/ethanphodo](https://github.com/ethanphodo)  
**LinkedIn:** [linkedin.com/in/ethan-do-infosci](https://linkedin.com/in/ethan-do-infosci/)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CI/CD Pipeline                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────────────┐  │
│   │  GitHub  │────▶│  Lint &  │────▶│  Build   │────▶│  Deploy          │  │
│   │   Push   │     │   Test   │     │  Docker  │     │  (Coming Soon)   │  │
│   └──────────┘     └──────────┘     └──────────┘     └──────────────────┘  │
│                                                                             │
│   Triggers:        Tools:           Output:          Target:                │
│   - Push to main   - ESLint         - Docker image   - AWS EC2 (planned)   │
│   - Pull request   - Jest           - Tagged build   - Container registry  │
│                    - npm audit                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
devops-platform/
├── app/                        # Application code
│   ├── server.js               # Express API server
│   ├── package.json            # Node.js dependencies
│   ├── .eslintrc.json          # Linting configuration
│   └── test/
│       └── server.test.js      # Jest test suite
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions pipeline
├── scripts/
│   └── deploy.sh               # Deployment script
├── docs/
│   └── architecture.png        # Architecture diagram
├── Dockerfile                  # Production multi-stage build
├── Dockerfile.dev              # Development with hot reload
├── docker-compose.yml          # Local orchestration
├── Jenkinsfile                 # Jenkins pipeline definition
└── README.md
```

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

### Run Locally with Docker

```bash
# Clone the repository
git clone https://github.com/ethanphodo/devops-platform.git
cd devops-platform

# Build and run
docker compose up --build

# Access the application
curl http://localhost:3000/health
```

### Run Locally without Docker

```bash
cd app
npm install
npm run dev

# Run tests
npm test

# Run linter
npm run lint
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check - returns status, timestamp, uptime |
| `/api/info` | GET | Application info - name, version, environment |
| `/api/quote` | GET | Returns a random DevOps quote |
| `/api/quotes` | GET | Returns all quotes |

### Example Responses

**GET /health**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T15:30:00.000Z",
  "uptime": 3600.5
}
```

**GET /api/info**
```json
{
  "name": "devops-platform",
  "version": "1.0.0",
  "environment": "production",
  "author": "Ethan Do"
}
```

---

## CI/CD Pipeline

### GitHub Actions

The pipeline runs on every push to `main` or `develop` and on pull requests:

1. **Lint** - ESLint checks code quality
2. **Test** - Jest runs unit tests with coverage
3. **Build** - Docker image is built and tagged
4. **Integration Test** - Container is started and health check verified

### Jenkins

A Jenkinsfile is included for environments using Jenkins:

```bash
# Pipeline stages:
# 1. Checkout → 2. Install → 3. Lint → 4. Test → 5. Build → 6. Test Image
```

---

## Docker

### Multi-Stage Build

The production Dockerfile uses a multi-stage build to minimize image size:

- **Stage 1 (builder):** Installs all dependencies, runs lint and tests
- **Stage 2 (production):** Copies only production dependencies and code

### Security Features

- Runs as non-root user (`nodeuser`)
- Uses Alpine base image (minimal attack surface)
- Health check configured for orchestration
- No dev dependencies in production image

### Build Commands

```bash
# Build production image
docker build -t devops-platform:latest .

# Build with specific tag
docker build -t devops-platform:1.0.0 .

# Run container
docker run -p 3000:3000 devops-platform:latest
```

---

## Testing

```bash
cd app

# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# View coverage report
open coverage/lcov-report/index.html
```

### Test Coverage

Tests cover:
- Health check endpoint
- API info endpoint
- Quote endpoints
- 404 error handling

---

## Roadmap

- [x] Express API with health checks
- [x] Docker containerization
- [x] GitHub Actions CI pipeline
- [x] Jenkins pipeline
- [ ] AWS EC2 deployment
- [ ] Terraform infrastructure as code
- [ ] Prometheus/Grafana monitoring
- [ ] Kubernetes deployment

---

## What I Learned Building This

1. **Multi-stage Docker builds** reduce image size and improve security
2. **Health checks** are critical for container orchestration
3. **CI/CD pipelines** catch issues before they reach production
4. **Infrastructure as code** makes deployments reproducible

---

## Technologies Used

| Category | Technology |
|----------|------------|
| Runtime | Node.js 18 |
| Framework | Express |
| Testing | Jest, Supertest |
| Linting | ESLint |
| Containerization | Docker |
| CI/CD | GitHub Actions, Jenkins |
| Future | AWS, Terraform, Kubernetes |

---

## License

MIT License - feel free to use this as a template for your own projects.

---

## Contact

- **Email:** ethanphodo@gmail.com
- **LinkedIn:** [linkedin.com/in/ethan-do-infosci](https://linkedin.com/in/ethan-do-infosci/)
- **GitHub:** [github.com/ethanphodo](https://github.com/ethanphodo)
