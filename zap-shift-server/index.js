// Local development server
const app = require('./api/[...slug]');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
});
