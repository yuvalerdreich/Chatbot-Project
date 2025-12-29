const authorize = require('../src/middleware/auth');

describe('Auth Middleware (Entra ID / Easy Auth)', () => {
    let req, res, next;
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
        process.env.NODE_ENV = 'production';
    });

    afterAll(() => {
        process.env.NODE_ENV = originalNodeEnv;
    });

    test('Should return 401 if x-ms-client-principal header is missing', async () => {
        await authorize(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('Should call next if x-ms-client-principal header exists', async () => {
        const principal = Buffer.from(JSON.stringify({ userDetails: 'user@example.com' }), 'utf8').toString('base64');
        req.headers['x-ms-client-principal'] = principal;

        await authorize(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test('Should call next in development even without x-ms-client-principal', async () => {
        process.env.NODE_ENV = 'development';

        await authorize(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
