# Use a specific node version for the build stage
FROM node:18.17.0 as build

# Set the working directory
WORKDIR /usr/local/app

# Copy the package.json and package-lock.json separately to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the application code
COPY ./ ./

# Build the application
RUN NODE_OPTIONS=--max-old-space-size=4096 npm run build

# Use a smaller nginx base image for the final image
FROM nginx:alpine

# Copy nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built files from the build stage
COPY --from=build /usr/local/app/dist/demo1 /usr/share/nginx/html

# Expose port 80
EXPOSE 80
