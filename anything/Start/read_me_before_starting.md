# 시작하기 전

아래 버튼을 누르면 더 편하게 이 문서를 볼 수 있다.

![alt](markdown.png)

깃허브 Main 브런치로 Pull 하셨나요?

그럼 바로 아래 목록을 순서대로 수행해봅시다.

## npm install

깃허브에서 pull한 뒤 매번 [package.json](../../package.json)
에서 변경된 패키지가 있는지 확인하자. 코드가 동작하지 않을 수도 있다! 그러나 매번 변경된 패키지가 있는지 확인하는건 매우 귀찮다..

그냥 입력합시다.

```shell
npm i
```

또는

```shell
npm install
```

친절하게 [node_modules](../../node_modules)에 패키지가 모두 깔려있는지 확인 후 없는 것만 깔아준다

## DB 초기화

우선 [Sunny씨의 글](../Database/database_setting.md)을 참고하면 더욱 이해하기 쉽다.

혹시 mysql을 설치하지 않았다면 [MySQL 설치](https://dev.mysql.com/downloads/installer/)부터 하자. 설치 후 GUI로 보고 싶다면 **MySQL Workbench** 또는 [VS Code MySQL extension](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2)을 이용하자.

앞으로 [Prisma](https://www.prisma.io/)라는 친구가 우리의 DB 관리를 도와줄 것이다. **Prisma**는 크게 두가지 일을 쉽게 해준다.

- **Schema 자동 작성 및 관계형 데이터베이스 연결**

  원래 SQL 스키마를 만드려면 어떻게 해야하는지 아는가..?

  **스키마->테이블->데이터&옵션**을 일일히 SQL QUERY를 이용하여 입력해야하지만 프리즈마를 사용하면 이를 훨씬 줄여준다.

  [schema.prisma](../../prisma/schema.prisma) 파일을 확인해보자.  Sunny씨가 직접 작성한 모델이다. 얼마나 간편한가.. 데이터베이스 모델 구축은 Sunny씨의 몫이니 우리는 이 파일을 통해 어떻게 MYSQL 초기화를 하는지 알아보기만 하자. 혹시나 **Prisma**가 궁금하다면 [여기](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-node-mysql)를 눌러보자.

- **데이터 추가 및 조회**

  SQL 쿼리를 통해 작업한다고 생각해보자.. 너무 힘들고 [보안에 취약하다](https://youtu.be/FoZ2cucLiDs?si=EuTgWhNKGZ3A8ew3). **@prisma/client**를 이용하면 SQL Attack을 어느정도 예방하고 JS문법을 통해 쉽게 데이터에 접근할 수 있다. 데이터 접근에 대해서는 [다음 문서](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-node-mysql)를 참고하자.

서론이 길었으니 바로 본론으로 들어가겠다.

### 환경변수 등록

[dotenv](https://www.daleseo.com/js-dotenv/)를 이용하여 중요한 보안 데이터를 실수로라도 배포하지 않도록 할 것이다. 중요한 비밀번호 혹은 키를 깃허브에 올리는 사고를 방지하기 위해 최상위 폴더에 **.env** 혹은 **.env.local**을 생성한다.

.env는 .local, .development, .production, .test등 나누어져 있는데 각 개발 단계에서 실수하지 않도록 분리하여 넣길 권장한다. 우리는 지금 초기단계에서 각자의 컴퓨터에서 개발하고 있으므로 **.env.local** 사용을 추천한다.

- .env 또는 .env.local

```shell
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

**USER**, **PASSWORD**, **HOST**, **PORT**, **DATABASE**에 본인의 환경에 맞는 값을 넣는다. 자세한 사항은 [Sunny씨의 글](../Database/database_setting.md) 가장 아래 문단을 살펴보자.

### .gitignore

[dotenv](https://www.daleseo.com/js-dotenv/)를 이용하는 이유가 무엇인가? 보안키를 노출하지 않아야하기 때문이다. 그런데 이걸 commit해버리면? 아이구 큰일이납니다.

[.gitignore](../../.gitignore) 에 해당 문단을 추가하자.

- .gitignore

```python
# local env files
.env
.env*.local
```

### Prisma migrate

[Prisma](https://www.prisma.io/) 파일을 바탕으로 SQL 초기화를 해줄 것이다. 이를 migrate 라고 부른다. [dotenv](https://www.daleseo.com/js-dotenv/)를 이용하여 migrate할 것이므로 아래 명령으로 수행한다.

- .env의 경우

```shell
npx prisma migrate dev
```

- .env.local의 경우 [("scripts" 참고)](../../package.json)

```shell
npm run prismaLocal
```

## NextAuth 초기 설정

현재 로그인 기능을 완벽히 구현하지는 않았지만 로그인기능 개발을 위해 일시적으로 [Github OAUTH](https://velog.io/@shyuuuuni/OAuth-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-with-github-%EB%A1%9C%EA%B7%B8%EC%9D%B8)를 이용해 일시적으로 구현해놓은 상태이다. **OAUTH** 를 이용하기 위해 보안 토큰이 필요하여 [dotenv](https://www.daleseo.com/js-dotenv/)에 아래의 환경변수를 추가할 필요가 있다.

- .env 또는 .env.local

```shell
...
GITHUB_ID=IDToken
GITHUB_SECRET=SecretToken
```

IDToken과 SecretToken은 Hoon쨩이 따로 카톡방에 배포한 파일을 확인하여 복사 붙여놓기 해준다. 노출되면 안되므로 꼭 주의하자..

여기까지 했다면 튜토리얼을 완료한 것이다. 축하합니다.

## 프로젝트를 실행해보자

```shell
npm run dev
```
