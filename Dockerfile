FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
FROM node:14-alpine AS production
WORKDIR /app
COPY --from=build /app .
RUN npm install bcrypt@5.1.0
RUN npm install bcrypt-promise@2.0.0
EXPOSE 3000
CMD ["npm", "start"]
