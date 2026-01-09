import request from 'supertest';
import express from 'express';

// 만약 app.ts에서 app을 export 하고 있다면 그걸 가져와도 되지만,
// 간단한 테스트를 위해 여기서 임시 앱을 만들어 테스트 원리를 보여드릴게요.
// 실제로는: import app from './app'; 하시면 됩니다.

const app = express();
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

describe('기본 API 테스트', () => {
  it('GET / 요청시 200 OK와 Hello World를 반환해야 한다', async () => {
    // request(app)이 가상의 서버를 띄워서 요청을 보냄
    const res = await request(app).get('/'); 
    
    // 검증(Expect) 단계
    expect(res.statusCode).toEqual(200); // 상태 코드가 200인지?
    expect(res.text).toEqual('Hello World'); // 응답 본문이 'Hello World'인지?
  });
});
