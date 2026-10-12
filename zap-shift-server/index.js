// Local development server
const app = require('./api/index');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
});
