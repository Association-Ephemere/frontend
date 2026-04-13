# frontend

React + Vite + TypeScript kiosk interface for the Ephemere photo printing stand. Lets operators browse photos, build a print ticket, and monitor job status in real time.

## Role in the architecture

```mermaid
flowchart LR
    frontend["frontend\n(React + Vite)"]
    jobsvc["job-svc\n(Minimal API)"]
    minio["MinIO\nphotos/low/"]

    frontend -->|GET /photos| jobsvc
    frontend -->|POST /jobs| jobsvc
    frontend -->|GET /jobs| jobsvc
    frontend -->|GET /jobs/{id}/stream SSE| jobsvc
    jobsvc -->|presigned URLs| minio
    minio -->|images| frontend
```

## Requirements

- Node 20+ for local development
- Docker for running via container
- job-svc accessible on the network

## Configuration

Create a `.env.local` file at the root (not committed):

```
VITE_JOB_SERVICE_URL=http://localhost:8080
VITE_PHOTO_REFRESH_INTERVAL=10000
```

## Run with Docker

```bash
docker pull ghcr.io/association-ephemere/frontend:latest
```

```bash
docker run \
  -e VITE_JOB_SERVICE_URL=http://<job-svc-host>:8080 \
  -e VITE_PHOTO_REFRESH_INTERVAL=10000 \
  -p 3000:3000 \
  ghcr.io/association-ephemere/frontend:latest
```

## Run in development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
