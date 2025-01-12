# builder container
# Use an official node image
FROM --platform=$BUILDPLATFORM node:14-alpine AS builder
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
# Reads args and use them to configure the build, setting
# them as env vars
ARG NODE_ENV
ARG API_URL

ENV NODE_ENV $NODE_ENV
ENV API_URL $API_URL

WORKDIR /app

# Install dependencies
COPY yarn.lock ./
COPY .package.json.without.version ./package.json
RUN yarn install
RUN yarn cache clean
COPY . .
RUN VERSION=`cat .version`; sed -i "s/%APPLICATION_VERSION%/$VERSION/" src/version.js
RUN HASH=`cat .githash`; sed -i "s/%APPLICATION_HASH%/$HASH/" src/version.js

RUN yarn run build

# ---

# runner container
#  - nginx, to serve static built Vue app

# Use an official nginx image
FROM nginx:1.13-alpine

# COPY dist from builder container to nginx html dir
COPY --from=builder /app/build /usr/share/nginx/html

#COPY config/nginx.default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# No need for CMD. It'll fallback to nginx image's one, which
