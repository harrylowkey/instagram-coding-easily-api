FROM public.ecr.aws/docker/library/node:18-alpine AS development
WORKDIR /usr/src/app
ARG ENVIRONMENT
COPY package*.json ./
COPY environments/${ENVIRONMENT}.env .env
RUN npm install --force
ADD . .
RUN npm run build

FROM public.ecr.aws/docker/library/node:18-alpine AS production
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app/node_modules/ ./node_modules/
COPY --from=development /usr/src/app/dist ./dist
EXPOSE 3001
CMD ["node", "/usr/src/app/dist/main.js"]
