const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService._reset(); // reset data before each test
});

describe('Tasks API', () => {
  test('GET /tasks should return empty array', async () => {
    const res = await request(app).get('/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
test('POST /tasks should create a new task', async () => {
  const res = await request(app)
    .post('/tasks')
    .send({ title: 'Learn Testing' });

  expect(res.statusCode).toBe(201);
  expect(res.body.title).toBe('Learn Testing');
});
test('POST /tasks should fail if title is missing', async () => {
  const res = await request(app)
    .post('/tasks')
    .send({});

  expect(res.statusCode).toBe(400);
});
test('GET /tasks should return created task', async () => {
  await request(app)
    .post('/tasks')
    .send({ title: 'Task 1' });

  const res = await request(app).get('/tasks');

  expect(res.body.length).toBe(1);
  expect(res.body[0].title).toBe('Task 1');
});
test('PUT /tasks/:id should update task', async () => {
  const createRes = await request(app)
    .post('/tasks')
    .send({ title: 'Old Task' });

  const id = createRes.body.id;

  const updateRes = await request(app)
    .put(`/tasks/${id}`)
    .send({ title: 'Updated Task' });

  expect(updateRes.statusCode).toBe(200);
  expect(updateRes.body.title).toBe('Updated Task');
});
test('DELETE /tasks/:id should delete task', async () => {
  const createRes = await request(app)
    .post('/tasks')
    .send({ title: 'Delete Me' });

  const id = createRes.body.id;

  const deleteRes = await request(app).delete(`/tasks/${id}`);

  expect(deleteRes.statusCode).toBe(204);

  const getRes = await request(app).get('/tasks');
  expect(getRes.body.length).toBe(0);
});
test('PATCH /tasks/:id/complete should mark task as done', async () => {
  const createRes = await request(app)
    .post('/tasks')
    .send({ title: 'Complete Me' });

  const id = createRes.body.id;

  const res = await request(app).patch(`/tasks/${id}/complete`);

  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('done');
});
test('GET /tasks/stats should return stats', async () => {
  await request(app).post('/tasks').send({ title: 'Task 1' });
  await request(app).post('/tasks').send({ title: 'Task 2' });

  const res = await request(app).get('/tasks/stats');

  expect(res.statusCode).toBe(200);
  expect(res.body.todo).toBeDefined();
});
test('GET /tasks with pagination should return correct page', async () => {
  for (let i = 1; i <= 5; i++) {
    await request(app).post('/tasks').send({ title: `Task ${i}` });
  }

  const res = await request(app).get('/tasks?page=1&limit=2');

  expect(res.body.length).toBe(2);
});
test('GET /tasks?status=todo should filter correctly', async () => {
  await request(app).post('/tasks').send({ title: 'Task 1', status: 'todo' });
  await request(app).post('/tasks').send({ title: 'Task 2', status: 'done' });

  const res = await request(app).get('/tasks?status=todo');

  expect(res.body.length).toBe(1);
  expect(res.body[0].status).toBe('todo');
});
test('PATCH /tasks/:id/assign should assign user to task', async () => {
  const createRes = await request(app)
    .post('/tasks')
    .send({ title: 'Assign Task' });

  const id = createRes.body.id;

  const res = await request(app)
    .patch(`/tasks/${id}/assign`)
    .send({ assignee: 'Meet' });

  expect(res.statusCode).toBe(200);
  expect(res.body.assignee).toBe('Meet');
});