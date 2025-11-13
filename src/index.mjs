import express from 'express';

const app = express();

app.use(express.json());

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

app.get('/', (req, res) => {
  res.status(201).send({msg: 'Hello from ExpressJS'});
});

app.get('/api/users', (req, res) => {
    console.log(req.query);
    const {
        query: {filter, value},
    } = req;
    if (filter && value) 
        return res.send();
          mockUsers.filter((u) => u[filter].includes(value)
        );
    return res.send(mockUsers);
}); 

app.post('/api/users', (req, res) => {
    const {body} = req;
    const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...body};
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
});

app.get('/api/users/:id', (req, res) => {
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);
    if (isNaN(parsedId)) 
        return res.status(400).send({msg: 'Invalid user id'});
    const user = mockUsers.find(u => u.id === parsedId);
    if (!user) 
        return res.status(404).send({msg: 'User not found'});
        return res.send(user);
});

app.get('/api/products', (req, res) => {
    res.send([{id: 1, name: 'Product 1', price: 100},
              {id: 2, name: 'Product 2', price: 150}]);
});

app.put('/api/users/:id', (req, res) => {
    const {body, params: { id },
} = req;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.status(400);
    const findUserIndex = mockUsers.findIndex((u) => u.id === parsedId);
    if (findUserIndex === -1) return res.status(404);
    mockUsers[findUserIndex] = {id: parsedId, ...body};
    return res.sendStatus(200);
});

app.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

app.delete('/api/users/:id', (req, res) => {
    const {
        params: {id},
    } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((u) => u.id === parsedId);
    if (findUserIndex === -1) return res.sendStatus(404);
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});