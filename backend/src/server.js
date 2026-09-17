const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {

    res.json({
        message: 'BizDesk API is running'
    });

});


app.use('/api/users', userRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/tickets', ticketRoutes);


app.listen(PORT, () => {

    console.log(
        `BizDesk backend running on http://localhost:${PORT}`
    );

});