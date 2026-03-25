FROM node:18

WORKDIR /app

# 1. First package files-a mattum copy pannunga
COPY package*.json ./

# 2. Dependencies-a install pannunga (Indha step ippo clear-ah nadakkum)
RUN npm install

# 3. Adhuku apram baaki ulla code-a copy pannunga
COPY . .

EXPOSE 5000

CMD ["node", "Server.js"]