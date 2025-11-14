import express from 'express';
import { query, validationResult, body, matchedData, checkSchema
  } from 'express-validator';
import { createUserValidationSchema} from './utils/validationSchemas.mjs';
const app = express();

app.use(express.json());

const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
}

const resolveIndexByUserId = (req, res, next) => {
    const {
        params: { id } 
    } = req; 
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((u) => u.id === parsedId);
    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next( );
}
const PORT = process.env.PORT || 3000;

const mockUsers = [
    {id: 1, username: 'Jane Doe', displayName: 'Jane'},
    {id: 2, username: 'John Doe', displayName: 'John'},
    {id: 3, username: 'Alice', displayName: 'Alice Wonderland'},
    {id: 4, username: 'Bob', displayName: 'Bobby'},
    {id: 5, username: 'Charlie', displayName: 'Charlie Brown'},
    {id: 6, username: 'Dave', displayName: 'David'},
    {id: 7, username: 'Eve', displayName: 'Evelyn'},
];

app.listen(PORT, () => {
  console.log(`Server is running on Port${PORT}`);
});

app.get('/', 
    (req, res) => {
  res.status(201).send({msg: 'Hello from ExpressJS'});
});

app.get(
    '/api/users', 
    query('filter')
    .isString()
    .notEmpty()
    .withMessage('Must not be a empty')
    .isLength({ min: 3, max: 10 })
    .withMessage('Filter must be a string between 3 and 10 characters'), 
    (req, res) => {
    const result = validationResult(req);
    console.log(result);
  const { filter, value } = req.query;

  if (filter && value) {
    const filteredUsers = mockUsers.filter((u) => {
      return u[filter] && u[filter].includes(value);
    });

    return res.send(filteredUsers);
  }
  return res.send(mockUsers);
});



app.post('/api/users',checkSchema(createUserValidationSchema), (req, res) => {
        const result = validationResult(req);
        console.log(result);
        if (!result.isEmpty())
            return res.status(400).send({ errors: result.array() });
        const data = matchedData(req);
        const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...body};
     mockUsers.push(newUser);
        return res.status(201).send(newUser);
    }
);

app.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    const user = mockUsers[findUserIndex];
    if (!user) return res.sendStatus(404);
    return res.send(user);
});

app.get('/api/products', (req, res) => {
    res.send([{id: 1, name: 'Product 1', price: 100},
              {id: 2, name: 'Product 2', price: 150}]);
});

app.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body};
    return res.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

app.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});