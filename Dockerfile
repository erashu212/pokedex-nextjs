# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire app to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]