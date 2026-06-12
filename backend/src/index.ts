import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes';
import { ticketRouter } from './routes/ticket.routes';
import { userRouter } from './routes/user.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/users', userRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export { app };

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
