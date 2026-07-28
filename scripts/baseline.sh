#!/usr/bin/env sh

set -eu

repository_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

echo "==> Backend: clean verify (JDK 21)"
docker run --rm \
  -v "$repository_root:/workspace" \
  -v medtrack-maven-cache:/root/.m2 \
  -w /workspace \
  eclipse-temurin:21-jdk-alpine \
  ./mvnw --batch-mode clean verify

echo "==> Frontend: npm ci (Node 22)"
docker run --rm \
  -v "$repository_root/interface-react:/workspace" \
  -v medtrack-npm-cache:/root/.npm \
  -w /workspace \
  node:22-alpine \
  npm ci

echo "==> Frontend: tests (expected to fail until tests are added)"
if docker run --rm \
  -e CI=true \
  -v "$repository_root/interface-react:/workspace" \
  -w /workspace \
  node:22-alpine \
  npm test -- --watchAll=false --coverage; then
  echo "Frontend tests passed."
else
  echo "Frontend tests failed; see docs/BASELINE_MODERNIZACAO.md." >&2
fi

echo "==> Frontend: production build with CI rules"
if docker run --rm \
  -e CI=true \
  -e REACT_APP_BACKEND_URL=http://localhost:8081 \
  -e REACT_APP_FRONTEND_URL=http://localhost:3000 \
  -v "$repository_root/interface-react:/workspace" \
  -w /workspace \
  node:22-alpine \
  npm run build; then
  echo "Frontend CI build passed."
else
  echo "Frontend CI build failed; see docs/BASELINE_MODERNIZACAO.md." >&2
fi

echo "==> Docker Compose: validate rendered configuration"
docker compose \
  --project-directory "$repository_root" \
  --env-file "$repository_root/.env.example" \
  config --quiet

echo "==> Baseline completed."
