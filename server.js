require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.json({
        message: 'Tech Blog API Server',
        status: 'Running',
        dependencies: {
            express: 'Loaded',
            dotenv: 'loaded',
            mysql2: 'rdy',
            sequelize: 'rdy',
            bcrypt: 'rdy',
            jwt: 'rdy'

        }
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});