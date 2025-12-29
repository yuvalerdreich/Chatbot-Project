const authorize = require('../src/middleware/auth');
const vaultService = require('../src/services/vaultService');

jest.mock('../src/services/vaultService');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    /**
     * Verifies that a 401 Unauthorized is returned when the header is missing.
     */
    test('Should return 401 if x-api-key header is missing', async () => {
        await authorize(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    /**
     * Verifies that a 403 Forbidden is returned when an incorrect key is provided.
     */
    test('Should return 403 if an invalid key is provided', async () => {
        req.headers['x-api-key'] = 'wrong-key';
        vaultService.getSecret.mockResolvedValue('valid-secret');

        await authorize(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    /**
     * Verifies that the request proceeds when a valid key is provided.
     */
    test('Should call next if a valid key is provided', async () => {
        req.headers['x-api-key'] = 'valid-secret';
        vaultService.getSecret.mockResolvedValue('valid-secret');

        await authorize(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});