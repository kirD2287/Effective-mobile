import express from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from'body-parser';

const prisma = new PrismaClient();
const products = express.Router();

products.use(bodyParser.json());

// Создание товара
products.post('/products', async (req, res) => {
  const { plu, name } = req.body;
  const product = await prisma.product.create({
    data: { plu, name }
  });
  res.json(product);
});

// Создание остатка
products.post('/stocks', async (req, res) => {
  const { quantityOnShelf, quantityInOrder, shopId, productId } = req.body;
  const stock = await prisma.stock.create({
    data: { quantityOnShelf, quantityInOrder, shopId, productId }
  });
  res.json(stock);
});

// Увеличение остатка
products.patch('/stocks/:id/increase', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const stock = await prisma.stock.update({
    where: { id: Number(id) },
    data: { quantityOnShelf: { increment: quantity } }
  });
  res.json(stock);
});

// Уменьшение остатка
products.patch('/stocks/:id/decrease', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const stock = await prisma.stock.update({
    where: { id: Number(id) },
    data: { quantityOnShelf: { decrement: quantity } }
  });
  res.json(stock);
});

// Получение остатков по фильтрам
products.get('/stocks', async (req, res) => {
  const { plu, shopId, quantityOnShelfFrom, quantityOnShelfTo } = req.query;
  const stocks = await prisma.stock.findMany({
    where: {
      ...(plu && { product: { plu } }),
      ...(shopId && { shopId: Number(shopId) }),
      ...(quantityOnShelfFrom && { quantityOnShelf: { gte: Number(quantityOnShelfFrom) } }),
      ...(quantityOnShelfTo && { quantityOnShelf: { lte: Number(quantityOnShelfTo) } })
    },
    include: { product: true, shop: true }
  });
  res.json(stocks);
});

// Получение товаров по фильтрам
products.get('/products', async (req, res) => {
  const { name, plu } = req.query;
  const products = await prisma.product.findMany({
    where: {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(plu && { plu })
    }
  });
  res.json(products);
});

export default products