import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

const mockUsers = [
    {id: 1, username: 'Jane Doe', displayName: 'Jane'},
    {id: 2, username: 'John Doe', displayName: 'John'}
];
app.get('/', (req, res) => {
  res.status(201).send({msg: 'Hello from ExpressJS'});
});

app.get('/api/users', (req, res) => {
    res.send(mockUsers);
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
app.listen(PORT, () => {
  console.log(`Server is running on Port${PORT}`);
});