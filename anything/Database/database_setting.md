# Prisma Migrate
이 부분은 처음부터 setting할 경우에 따라하면 되는 부분
## 시작 
Prisma를 사용하기 위한 폴더를 생성한다. 
우리의 경우는 작업 중인 파일에 하면 된다. 
```shell
mkdir hello-prisma
cd hello-prisma
```
Node.js project를시작한다. 
이때 Prisma CLI를 개발 dependency로 추가하고 Node.js app을 위한 초기 설정으로 package.json 파일을 만든다.
```shell
npm init -y
npm install prisma --save-dev
```
npx로 prisma를 invoke한다. 
```shell
npx prisma
```
prisma schema 파일을 만들어 Prisma project를 생성한다. 
schema.prisma 파일을 포함한 prisma directory를 생성한다.
.env 파일을 root 디렉토리에 생성한다. (.env = 환경변수를 저장하는 파일)
```
npx prisma init
```
## 데이터베이스 연결
*npx prisma init* 명령어로 생성한 *schema.prisma* 파일에서 *datasource* block을 수정한다. 
prisma의 기본 schema는 PostgreSQL이므로 우리가 사용하는 mySQL로 변경한다.
provider는 사용한 데이터베이스를 말하고 url은 database connection URL을 의미한다. 
```prisma
datasource db {
	provider = "mysql"
	url = env("DATABASE_URL")
}
```

url 필드는 직접 지정할 수도 있지만 .env 파일을 통해 설정하도록 한다.
아래는 connection URL의 형식이다.
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

URL 예시
```env
DATABASE_URL="mysql://TOM:1234@localhost:1234/ABCD"
```
## Prisma Migrate 사용
### Database Schema 생성
Database에서 table을 만들기 위해 Prisma Migrate를 사용한다. 
아래는 prisma data model의 예시로 schema.prisma 파일에 작성하면 된다. 
우리는 이미 되어 있으니 할 필요 없다.
```prisma
model Post { 
	id Int @id @default(autoincrement()) 
	createdAt DateTime @default(now())
	updatedAt DateTime @updatedAt 
	title String @db.VarChar(255) 
	content String? 
	published Boolean @default(false) 
	author User @relation(fields: [authorId], references: [id]) 
	authorId Int 
} 

model Profile { 
	id Int @id @default(autoincrement()) 
	bio String? 
	user User @relation(fields: [userId], references: [id]) 
	userId Int @unique 
} 

model User { 
	id Int @id @default(autoincrement()) 
	email String @unique 
	name String? 
	posts Post[] 
	profile Profile? 
}
```

data model을 database schema로 매핑하기 위해서 prisma migrate CLI 명령어를 사용한다. 
-> 새로운 SQL migration 파일을 만든다.
-> database에 대한 SQL migration 파일을 실행한다. 
>*prisma migrate dev*가 실행되고 *generate*가 내부적으로 호출된다. *prisma-client-js* generator가 정의된다면 *@prisma/client*가 설치되었는지 확인하고 없다면 설치한다. 
```shell
npx prisma migrate dev --name init
```
=> Prisma Migrate로 database에 세 개의 table이 생성된다. 
=> 우리는 우리의 데이터베이스 table이 생성된다. 


# 사실상 여러분이 하셔야할 것은 이거
이 부분은 git pull 하신 여러분이 우리 프로젝트에 적용하기 위한 방법

**1. .env 파일에 database connection URL 변수 만들기**
여러분의 폴더의 root에 .env 또는 .env.local 파일을 생성합니다. (이미 되어 있으면 안해도 됨)

.env 또는 .env.local 파일에 다음과 같은 문장을 추가합니다. 아래 문장은 예시입니다.
USER , PASSWORD , HOST , PORT , DATABASE에 각자의 환경에 맞게 값을 넣어주면 됨.
USER : 말 그대로 사용자
PASSWORD : USER에 대한 비번
HOST : database의 주소 (localhost 적으면 됨)
PORT : ㅇㅇ
DATABASE : 여러분이 이 데이터베이스를 저장할 이름
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

**2. 명령어 입력하기**
다른 설정은 해놓았으니 여러분은 *npm install* 명령어로 prisma를 적용시키고
```shell
npm install
```
다음 명령어를 통해 데이터베이스를 만들면 된다.

- .env의 경우
```shell
npx prisma migrate dev
```

- .env.local의 경우
```shell
npm run prismaLocal
```

--name init은 migration 파일명을 설정하는 것이니 원하는 이름으로 설정하면 된다. 

명령어 입력하고 각자 database 확인할 때 쓰는 프로그램 들어가서 확인해보면 만들어져 있다.