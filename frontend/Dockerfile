# Use a lightweight Node image
FROM node:16-alpine as builder

# Set working directory
WORKDIR /app/frontend/

# Copy package.json and package-lock.json to install dependencies
COPY package*.json /app/frontend/
RUN npm install

# Copy the entire project directory
COPY . /app/frontend/

# Build the React app
RUN npm run build

# Stage 2 - Use Nginx to serve the React app
FROM nginx:alpine

# Copy the built files from the previous stage to the nginx directory
COPY --from=builder /app/frontend/build /usr/share/nginx/html
RUN apk add --no-cache bash

# Expose port 80 to the outside world
EXPOSE 80

# CMD is not required as nginx image has a default CMD to start nginx
