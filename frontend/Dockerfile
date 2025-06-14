FROM node:lts

WORKDIR /app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent --legacy-peer-deps \
    && npm install -D tailwindcss postcss autoprefixer axios @vitejs/plugin-react react-router-dom \
    && npm install @react-google-maps/api \
    && npx tailwindcss init -p

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]