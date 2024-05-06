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
EXPOSE 3001
CMD [ "node", "/usr/src/app/dist/main" ]
