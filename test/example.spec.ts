import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test('home', async () => {
  await supertest(BASE_URL).get('/').expect(200)
})

test('api', async () => {
  await supertest(BASE_URL).get('/api').expect(200)
})
