참고자료

1. [HTTP와 HTTPS의 차이점은 무엇인가요?](https://aws.amazon.com/ko/compare/the-difference-between-https-and-http/)
2. [HTTP와 REST API이란 무엇인가](https://velog.io/@beneficial/HTTP%EC%99%80-REST-API%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80)
3. [🌐 REST API 구성/특징 총 정리](https://inpa.tistory.com/entry/WEB-%F0%9F%8C%90-REST-API-%EC%A0%95%EB%A6%AC)

# HTTP 프로토콜

**HTTP(Hypertext Transfer Protocol)는 클라이언트와 서버 간 통신을 위한 통신 규칙 세트 또는 프로토콜이다.**

일반적으로 Client가 Server에 HTTP Request(요청)을 전송하고 Server가 이에 Response(응답)하는 방식으로 동작한다. 요청과 응답은 일반 텍스트로 교환되며 Server는 아래의 응답코드도 포함하여 전송한다.

- 200: OK(정상)
- 400: Bad request(잘못된 요청)
- 404: Resource not found(리소스를 찾을 수 없음)
...

## HTTP의 발전

최초의 HTTP/1.1 버전부터 HTTP/2, HTTP/3 라는 업그레이드된 프로토콜로 발전되어나갔다. 주로 효율성을 개선하였는데 HTTP/2는 텍스트가 아닌 바이너리교환으로 변경되었으며 HTTP/3는 실시간 스트리밍, 최신데이 전송 요구 사항을 지원하도록 변경되었다.

하지만 HTTP는 약점이 존재한다. 하이재킹이다. HTTP는 암호화되지 않은 데이터를 서로 교환하게 되는데 이를 악의적인 공격자가 중간에 하이재킹(탈취)을 시도한다면 그대로 데이터가 노출될 것이다.

이를 보완한 암호화된 HTTP 프로토콜이 HTTPS이다. HTTPS는 SSL/TLS(보안 기술)와 HTTP/2를 포함하는 기술이다.

## HTTPS

HTTPS는 SSL/TLS 인증서를 통해 통신을 보호한다. 인증서는 독립된 인증 기관(CA)에서 관리하며 SSL 인증서는 암호화 정보도 포함하므로 서버와 웹 브라우저는 암호화된 데이터를 교환할 수 있다. 아래와 같이 동작한다.

1. 사용자 브라우저의 주소 표시줄에 https:// URL 형식을 입력하여 HTTPS 웹 사이트를 방문합니다.
2. 브라우저는 서버의 SSL 인증서를 요청하여 사이트의 신뢰성을 검증하려고 시도합니다.
3. 서버는 퍼블릭 키가 포함된 SSL 인증서를 회신으로 전송합니다.
4. 웹 사이트의 SSL 인증서는 서버 아이덴티티를 증명합니다. 브라우저에서 인증되면, 브라우저가 퍼블릭 키를 사용하여 비밀 세션 키가 포함된 메시지를 암호화하고 전송합니다.
5. 웹 서버는 개인 키를 사용하여 메시지를 해독하고 세션 키를 검색합니다. 그런 다음, 세션 키를 암호화하고 브라우저에 승인 메시지를 전송합니다.
6. 이제 브라우저와 웹 서버 모두 동일한 세션 키를 사용하여 메시지를 안전하게 교환하도록 전환합니다.

[SSL/TLS 더 알아보기](https://aws.amazon.com/ko/what-is/ssl-certificate/)

HTTPS의 장점은 아래와 같다.

- 송/수신 데이터를 암호화 함으로써 데이터가 탈취되어도 노출되지 않아 보안성이 뛰어나다.
- 검색엔진과 브라우저는 HTTP보다 HTTPS를 우선시하여 애플리케이션의 권위가 높아진다.
- HTTP 애플리케이션에 비해 HTTPS 애플리케이션의 로드 속도가 더 빠르다.

# REST API

REST(Representational State Transfer)는 HTTP 프로토콜로 통신을 할 때 지켜야할 규칙이라고 볼 수 있으며 아래의 구성으로 이루어져있다.

- 자원(Resource) : URI
- 행위(Verb) : HTTP Method
- 표현(Representations)

REST의 특징은 아래와 같다.

- Uniform: 동작과정이 통일되어있고 정형화 되어있다.
- Stateless: 모든 동작이 무상태성을 지닌다.
- Cacheable: HTTP의 캐싱기능을 적용하여 캐싱 구현이 가능하다.
- Self-descriptiveness: REST API 메세지만 보고도 이해할 수 있다.
...

