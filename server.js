import express from 'express';
import dotenv from 'dotenv';
import products from './products.js'
import action from './actionHistory.js'


dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use('/api', action)
app.use('/api', products)

async function start () {
    try {
        await app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}


start() 