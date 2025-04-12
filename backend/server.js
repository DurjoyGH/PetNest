const connectDB = require('./config/db');
const { port: configPort } = require('./config/env');

const app = require('./app');

const PORT = process.env.PORT || configPort;

connectDB();

app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`.yellow.bold);
});

