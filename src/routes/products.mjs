import { Router } from "express";

const router = Router();

router.get('/api/products', (req, res) => {
    res.send([{id: 1, name: 'Product 1', price: 100}]);
});

export default router;