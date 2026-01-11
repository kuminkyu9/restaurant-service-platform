process.env.JWT_SECRET = 'test-secret-key-1234';

import request from 'supertest';
import app from '../app'; // 분리한 app 가져오기
import prisma from '../utils/prisma';
import jwt from 'jsonwebtoken';

// 무조건 고정된 키 사용
const JWT_SECRET = 'test-secret-key-1234';

describe('식당 CRUD 통합 테스트', () => {
  let userId: number;

  let token: string;
  let createdRestaurantId: number; // 생성된 식당 ID를 저장할 변수

  beforeAll(async () => {
    const user = await prisma.owner.create({
      data: {
        email: `test${Date.now()}@test.com`,
        password: '1234',
        name: '테스트유저'
      }
    });
    userId = user.id

    // 1. 테스트용 토큰 발급 (사장님 ID: 1 가정)
    token = jwt.sign({ id: userId, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    // 식당 먼저 지워야함
    if (createdRestaurantId) {
      await prisma.restaurant.deleteMany({where: {id: createdRestaurantId}})
    }

    if (userId) {
      await prisma.owner.delete({where: {id: userId}});
    }

    await prisma.$disconnect();
  });

  // 1. POST: 식당 생성 테스트
  it('POST /restaurants - 식당 생성', async () => {
    const res = await request(app)
      .post('/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '테스트 식당',
        address: '서울시 강남구',
        totalTable: 5,
        // ownerId: userId
      });

    if (res.status !== 201) {
      console.error('API 생성 실패:', res.status, res.body);
    }  

    // 상태 코드 검증
    expect(res.status).toBe(201);

    // 생성된 ID 저장 (나중에 수정/삭제 때 쓰려고)
    createdRestaurantId = res.body.data.id; 
    expect(res.body.data.name).toBe('테스트 식당');
  });

  // 2. PATCH: 식당 정보 수정 테스트
  it('PATCH /restaurants/:id - 식당 이름 수정', async () => {
    const res = await request(app)
      .patch(`/restaurants/${createdRestaurantId}`) // 아까 만든 그 식당 ID
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '수정된 테스트 식당' }) // 이름 변경 요청
      .expect(200);

    expect(res.body.data.name).toBe('수정된 테스트 식당');
  });

  // 3. GET: 식당들 가져오기
  it('GET /restaurants - response: 식당 목록과 200', async () => {
    const res = await request(app)
      .get('/restaurants/my')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    
    console.log('가져온 데이터: ', res.body);
  });

  // 4. GET: 식당 가져오기
  it('GET /restaurants - response: 식당 목록과 200', async () => {
    const res = await request(app)
      .get(`/restaurants/${createdRestaurantId}`)
      .expect(200);

    // expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.data.id).toBe(createdRestaurantId);
    
    console.log('가져온 데이터: ', res.body);
  });

  // 5. DELETE: 식당 삭제 테스트
  it('DELETE /restaurants/:id - 식당 삭제', async () => {
    await request(app)
      .delete(`/restaurants/${createdRestaurantId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200); // 삭제 성공
    
    // 진짜 지워졌는지 확인 (GET 요청 해보면 404나 빈 값이 나와야 함)
    const check = await prisma.restaurant.findUnique({
      where: { id: createdRestaurantId }
    });

    expect(check).not.toBeNull();
    expect(check?.deletedAt).not.toBeNull();
  });
});
