/* eslint-disable */
const request = require('supertest');
const app = require('../../app');
const db = require('../../models');
const { ROLE_USER } = require('../../constants/user.constants');
const server = app.listen(process.env.PORT_TEST);


const user = {
  firstName: 'username',
  lastName: 'testLastName',
  email: 'usertest@test.com',
  password: 'Test123**',
  roleId: ROLE_USER,
};

 beforeAll(async () => {
  try {
      await db.User.destroy({
      truncate: true,
    });
  } catch (error) {
    console.log(error)
  }
}); 


describe('POST/auth/register', () => {

  test('should return 201 status code, token, message and user', async () => {

    const result = await request(server)
      .post('/auth/register')
      .send(user)
      .expect(201)
      
    expect(result.body.token).toBeDefined();
    expect(result.body.user).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.message).toEqual('User created successfully');
    expect(result.body.user.firstName).toEqual('username');
    expect(result.body.user.lastName).toEqual('testLastName');
    expect(result.body.user.email).toEqual('usertest@test.com');   
  });

  test('The content-type of response should be application/json', async () => {

    await request(server)
      .post('/auth/register')
      .send(user)
      .expect('Content-type', /application\/json/);

    await request(server)
      .post('/auth/register')
      .expect('Content-type', /application\/json/);
  });

  test('Should return 422 status code and message if request no contain all required params', async () => {
    const user = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    const result = await request(server)
      .post('/auth/register')
      .send(user)
      .expect(422);

    expect(result.body.errors).toBeDefined();
    expect(result.body.errors.length).toBe(4);
  });

  test('should return 200 http code and message if exist email', async () => {
    await request(server)
      .post('/auth/register')
      .send(user);

    const result = await request(server)
      .post('/auth/register')
      .send(user)
      .expect(200);

    expect(result.body.message).toBeDefined();
    expect(result.body.message).toEqual('Email already in use');
  })
});

describe('POST/auth/login', () => {
  const userLogin = {
    email: 'usertest@test.com',
    password: 'Test123**',
  };

  test('The content-type of response should be application/json', async () => {
    await request(server)
      .post('/auth/register')
      .send(user);

    await request(server)
      .post('/auth/login')
      .send(userLogin)
      .expect('Content-type', /application\/json/);

    await request(server)
      .post('/auth/login')
      .expect('Content-type', /application\/json/);
  });

  test('should return 200 status code and token', async () => {
    await request(server)
      .post('/auth/register')
      .send(user)

    const result = await request(server)
      .post('/auth/login')
      .send(userLogin)
      .expect(200);

    expect(result.body.token).toBeDefined();
  });

  test('should return 400 status code and msg if is incorrect password', async () => {
    await db.User.create(user);

    const userIncorrectPassword = {
      email: 'usertest@test.com',
      password: 'Test123',
    };

    const result = await request(server)
      .post('/auth/login')
      .send(userIncorrectPassword)
      .expect(400);

    expect(result.body.msg).toBeDefined();
    expect(result.body.msg).toEqual('The passsword is wrong');
  });

  test('should return 400 status code an msg if is empty password', async () => {
    await db.User.create(user);

    const userEmptyPassword = {
      email: 'usertest@test.com',
      password: '',
    };

    const result = await request(server)
      .post('/auth/login')
      .send(userEmptyPassword)
      .expect(400);

    expect(result.body.msg).toBeDefined();
    expect(result.body.msg).toEqual('The passsword is wrong');
  });

  test('should return 404 status code if not exist email', async () => {
    const emailNotExist = {
      email: 'usernotexist@test.com',
      password: 'Test123**',
    };

    const result = await request(server)
      .post('/auth/login')
      .send(emailNotExist)
      .expect(404);

    expect(result.body.msg).toBeDefined();
    expect(result.body.msg).toEqual('The usernotexist@test.com not exist');
  });

  test('should return 404 status code if email is empty', async () => {
    const emailNotExist = {
      email: '',
      password: 'Test123**',
    };

    const result = await request(server)
      .post('/auth/login')
      .send(emailNotExist)
      .expect(404);

    expect(result.body.msg).toBeDefined();
    expect(result.body.msg).toEqual('The  not exist');
  });

  test('should return 404 status code if email is empty and password', async () => {
    const notExistParams = {
      email: '',
      password: '',
    };

    const result = await request(server)
      .post('/auth/login')
      .send(notExistParams)
      .expect(404);

    expect(result.body.msg).toBeDefined();
    expect(result.body.msg).toEqual('The  not exist');
  });
});

describe('GET/auth/me', () => {

  test('should return 403 code and should be application/json if not exist token', async () => {
    const result = await request(server)
      .get('/auth/me')
      .expect(403)
      .expect('Content-type', /application\/json/);

    expect(result.body.error).toContain('A token is required for authentication');
  });

  test('should return 200 status code and user', async () => {

    const userLogin = {
      email: 'usertest@test.com',
      password: 'Test123**'
    };
    const { body }  = await request(server)
      .post('/auth/login')
      .send(userLogin);
    console.log(body.token)
    const result = await request(server)
      .get('/auth/me')
      .auth(body.token, { type: "bearer" })
      .expect(200);
      console.log(result)
    //expect(result.body.user).toBeDefined();
    expect(result.body.user.email).toEqual('usertest@test.com');
  });
});

afterAll(() => {
  server.close();
});
