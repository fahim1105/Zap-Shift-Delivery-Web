// Minimal test to see if Vercel is working
module.exports = (req, res) => {
    res.json({ message: 'Test API works!', path: req.url });
};
