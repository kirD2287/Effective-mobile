import express from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from'body-parser';

const prisma = new PrismaClient();
const action = express();

action.use(bodyParser.json())

// Создание истории
action.post('/action-history', async (req, res) => {
    const { action, shopId, productId } = req.body;
    const actionHistory = await prisma.actionHistory.create({
      data: { action, shopId, productId }
    });
    res.json(actionHistory);
  });
  
  // Получение истории действий с фильтрами
  action.get('/action-history', async (req, res) => {
    const { shopId, productId, dateFrom, dateTo } = req.query;
    const actionHistory = await prisma.actionHistory.findMany({
      where: {
        ...(shopId && { shopId: Number(shopId) }),
        ...(productId && { productId: Number(productId) }),
        ...(dateFrom && dateTo && {
          date: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo)
          }
        })
      },
      include: { shop: true, product: true }
    });
    res.json(actionHistory);
  });
  
  export default action