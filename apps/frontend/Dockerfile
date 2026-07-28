FROM node:22-alpine
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY apps/frontend/package.json apps/frontend/package.json

RUN npm ci --workspace @medtrack/frontend
COPY apps/frontend apps/frontend
WORKDIR /workspace/apps/frontend
EXPOSE 3000

CMD ["npm", "start"]
