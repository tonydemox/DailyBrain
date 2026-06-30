const errorHandler = (err, req, res, next) => {
    console.log('Errore completo:', err);

    const status = err.status || 500;
    const message = err.message || 'Errore interno del backend';

    res.status(status).json({ error: message });
};

module.exports = errorHandler;