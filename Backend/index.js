import express from 'express';

import cardsRoutes from './src/routes/cards.routes.js';
import usersRoutes from './src/routes/users.routes.js';
import recordsRoutes from './src/routes/records.routes.js';

import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';

import {PORT} from './src/config.js';

const app = express();

const server = http.createServer(app); 
const io = new Server(server, {       
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('Administrador se ha conectado');
  
});

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:3001', "http://localhost:5173"],
  methods: ['OPTIONS','GET', 'POST', 'PUT', 'DELETE']
}

app.use(cors(corsOptions))

app.use(express.json());

app.use(cardsRoutes);
app.use(usersRoutes);
app.use(recordsRoutes);

export { io };

// app.listen(3000)
server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
