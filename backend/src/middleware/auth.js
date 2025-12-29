function decodeEasyAuthPrincipal(headerValue) {
    try {
        const json = Buffer.from(String(headerValue), 'base64').toString('utf8');
        return JSON.parse(json);
    } catch (_) {
        return null;
    }
}

const authorize = (req, res, next) => {
    if ((process.env.NODE_ENV || '').toLowerCase() === 'development') {
        return next();
    }

    const principalHeader = req.headers['x-ms-client-principal'];
    if (principalHeader) {
        const principal = decodeEasyAuthPrincipal(principalHeader);
        req.user = principal || { raw: principalHeader };
        return next();
    }

    return res.status(401).json({
        error: 'Unauthorized: Entra ID authentication is required (enable App Service Authentication / Easy Auth).'
    });
};

module.exports = authorize;
