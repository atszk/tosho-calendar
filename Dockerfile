FROM node:22-slim@sha256:d943bf20249f8b92eff6f605362df2ee9cf2d6ce2ea771a8886e126ec8714f08
RUN npm install -g npm@11.6.1
WORKDIR /workspace/fire-dept-calendar
COPY fire-dept-calendar/package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
