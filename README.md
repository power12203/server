# blog_server

이 프로젝트는 Koa와 MongoDB를 사용하여 구현된 간단한 웹 어플리케이션입니다. 사용자는 회원가입과 로그인을 통해 포스트를 작성하고 관리할 수 있습니다.

## 설치 및 시작

1. **Node.js와 MongoDB 설치**

   - Node.js와 MongoDB가 설치되어 있지 않다면 [Node.js 공식 웹사이트](https://nodejs.org/)에서 Node.js를 다운로드하고 [MongoDB 공식 웹사이트](https://www.mongodb.com/)에서 MongoDB를 설치하세요.

2. **프로젝트 설정**

   - 이 레포지토리를 클론합니다:

     ```
     git clone https://github.com/your/repository.git
     cd project-directory
     ```

   - 필요한 패키지를 설치합니다:

     ```
     npm install
     ```

3. **환경 변수 설정**

   - 프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음과 같이 설정합니다:

     ```
     PORT=4000
     MONGO_URI=mongodb://your-username:your-password@your-host:your-port/your-database
     JWT_SECRET=your-secret-key
     ```

4. **서버 시작**

   - 다음 명령어를 사용하여 서버를 시작합니다:

     ```
     npm start
     ```

   - 서버가 시작되면 `http://localhost:4000`에서 API를 테스트할 수 있습니다.

## API 엔드포인트

### 회원 인증 (Auth)

- **POST /api/auth/register**
  - 회원 가입을 수행합니다. 유효한 사용자 이름과 비밀번호를 포함해야 합니다.
- **POST /api/auth/login**
  - 로그인을 수행합니다. 등록된 사용자 이름과 비밀번호를 사용하여 로그인합니다.
- **POST /api/auth/logout**
  - 로그아웃을 수행합니다. 로그인된 상태에서만 사용할 수 있습니다.
- **GET /api/auth/check**
  - 현재 로그인된 사용자를 확인합니다.

### 포스트 관리 (Post)

- **GET /api/posts**
  - 모든 포스트 목록을 가져옵니다.
- **POST /api/posts**
  - 새로운 포스트를 작성합니다. 로그인된 상태에서만 사용할 수 있습니다.
- **GET /api/posts/:id**
  - 특정 ID의 포스트를 조회합니다.
- **DELETE /api/posts/:id**
  - 특정 ID의 포스트를 삭제합니다. 작성자 본인만 가능합니다.
- **PATCH /api/posts/:id**
  - 특정 ID의 포스트를 업데이트합니다. 작성자 본인만 가능합니다.

## 기여

이 프로젝트는 기여를 환영합니다! Issue를 열어 새로운 기능을 제안하거나 Pull Request를 보내세요.

## 라이센스

MIT License
