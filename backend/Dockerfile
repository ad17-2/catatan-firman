# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim
WORKDIR /backend

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    ffmpeg \
    python3 \
    python3-pip \
  && python3 -m pip install --no-cache-dir --break-system-packages yt-dlp

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

USER node

ENTRYPOINT ["npm", "start", "--"]
CMD ["--help"]
