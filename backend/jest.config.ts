import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',            // TypeScript 파일을 실행할 수 있게 해주는 설정
  testEnvironment: 'node',      // 백엔드(Node.js) 환경에서 테스트
  testMatch: ['**/*.spec.ts', '**/*.test.ts'], // 테스트 파일 찾는 규칙
  verbose: true,                // 테스트 실행 시 내용을 자세히 출력
  forceExit: true,              // 테스트가 끝나면 프로세스 강제 종료 (DB 연결 등 잔여 프로세스 방지)

  rootDir: './',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // backend/tsconfig.json 파일 지정
    }],
  },
  // 👇 테스트 환경에서는 무조건 이 환경변수를 씁니다!
  testEnvironmentOptions: {
    env: {
      JWT_SECRET: 'test-secret-key-1234', // 이걸로 고정!
      NODE_ENV: 'test'
    }
  },
};

export default config;
