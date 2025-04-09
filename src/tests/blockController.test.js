const { getBlocks } = require('../controllers/blockController');
const Block = require('../models/Block');

jest.mock('../models/Block');

test('getBlocks returns paginated blocks', async () => {
  const mockBlocks = { count: 2, rows: [{ id: 1, name: 'Block1' }, { id: 2, name: 'Block2' }] };
  Block.findAndCountAll.mockResolvedValue(mockBlocks);

  const req = { query: { page: 1, limit: 10 } };
  const res = { json: jest.fn() };
  await getBlocks(req, res);

  expect(res.json).toHaveBeenCalledWith({
    total: 2,
    pages: 1,
    data: mockBlocks.rows,
  });
});

test('getBlocks handles errors', async () => {
  Block.findAndCountAll.mockRejectedValue(new Error('DB error'));
  const req = { query: {} };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  await getBlocks(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});