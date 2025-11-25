import express from 'express';
import routes from './routes/users.mjs';  

const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on Port${PORT}`);
});

app.get('/', (req, res) => {
  res.status(201).send({msg: 'Hello from ExpressJS'});
});
