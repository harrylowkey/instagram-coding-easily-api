FROM public.ecr.aws/docker/library/node:18-alpine AS development
WORKDIR /usr/src/app
ARG ENVIRONMENT
RUN npm install -g pnpm@8.14.1
COPY package.json pnpm-lock.yaml ./
COPY environments/${ENVIRONMENT}.env .env
RUN pnpm install
ADD . .
RUN pnpm run build

FROM public.ecr.aws/docker/library/node:18-alpine AS production
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app/node_modules/ ./node_modules/
COPY --from=development /usr/src/app/dist ./dist
EXPOSE 3001
CMD ["node", "/usr/src/app/dist/main.js"]
