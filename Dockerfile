FROM node:20-slim AS base
WORKDIR /usr/src/app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ARG ENVIRONMENT
COPY package.json pnpm-lock.yaml ./
COPY environments/${ENVIRONMENT}.env .env
ADD . .



FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
WORKDIR /usr/src/app
COPY --from=prod-deps /usr/src/app/node_modules/ ./node_modules
COPY --from=build /usr/src/app/dist ./dist
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
EXPOSE 3001
CMD [ "node", "/usr/src/app/dist/main" ]
