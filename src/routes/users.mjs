import { Router } from "express";
import { 
    query, 
    validationResult, 
    checkSchema, 
    matchedData
}   from "express-validator";
import { mockUsers } from '../utils/constants.mjs';
import { createUserValidationSchema} from '../utils/validationSchemas.mjs';
import { resolveIndexByUserId } from '../utils/middlewares.mjs';

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mockUsers);
  }
);

router.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    const user = mockUsers[findUserIndex];
    if (!user) return res.sendStatus(404);
    return res.send(user);
});

router.post(
  '/api/users',
  checkSchema(createUserValidationSchema), 
  (req, res) => {
        const result = validationResult(req);
        console.log(result);
        
        if (!result.isEmpty())
            return res.status(400).send({ errors: result.array() });
        const data = matchedData(req);
        const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...data};
     mockUsers.push(newUser);
        return res.status(201).send(newUser);
    }
);

router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body};
    return res.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});

export default router;