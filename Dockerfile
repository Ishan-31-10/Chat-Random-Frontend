# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
RUN npm install tailwindcss @tailwindcss/forms
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY public/firebase-messaging-sw.js /usr/share/nginx/html/firebase-messaging-sw.js
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
