#lets write dockerfile for client
# Step 1: Use an existing docker image as a base-appropriate version of node
FROM node:alpine
# Step 2: Specify a work directory
WORKDIR /usr/app
# Step 3: Copy the package.json file from client folder from the local machine to the container
COPY ./package.json ./
# Step 4: Install some dependencies
RUN npm install --force
# Step 5: Copy the rest of the files from the local machine to the container
COPY ./ ./
# Step 6: Default command
CMD ["npm", "start"]
