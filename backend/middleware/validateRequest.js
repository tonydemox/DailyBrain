const validateRequest = (req, res, next) => {
    if (req.method === 'POST' && !req.body.text) {
        return res.status(400).json({ error: 'Il campo tesìxt è obbligatorio'});
    }
    next();
};

module.exports = validateRequest;