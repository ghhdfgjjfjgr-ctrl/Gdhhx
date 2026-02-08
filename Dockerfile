FROM node:20-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends wget ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN wget -q https://www.princexml.com/download/prince_15.4-1_debian12_amd64.deb -O /tmp/prince.deb \
  && apt-get update \
  && apt-get install -y --no-install-recommends /tmp/prince.deb \
  && rm -f /tmp/prince.deb \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
