# openbook-server

openbook-server is backend for a shared expense tracking application openbook.

## Installation

1. Clone the repository

```bash
git clone https://github.com/openbook-org/openbook-server
```

2. Install dependencies

```bash
cd openbook-server
npm install
```

3. Create a `.env` file in the root directory of the project and add the following environment variables, (replace the values with your own)

```bash
ENV=development
PORT=5000
JWT_SECRET=secret
JWT_EXPIRE=30d
MONOGDB_URI=mongodb://localhost:27017/openbook-dev
```

4. Start the server

```bash
npm start
```

## API Documentation

Postman collection: [openbook-server.postman_collection](https://www.postman.com/solar-meteor-383169/workspace/openbook-server)
