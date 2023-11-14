# 들어가기 전

우리는 Auth를 다루기 위해 세션, 쿠키, 토큰 등을 공부해야 하지만 단계적으로 접근해야할 필요가 있고 배경지식부터 길러야함을 느꼈다. 그래서 먼저 Client와 Server의 통신이 어떻게 이루어지는지 알아보려한다. 여기서 다룰 내용은 읽어보지 않아도 상관없지만 분명히 Auth 로직을 구현하는데 도움이 될 것이다.

참고자료

1. [아주 쉽게 이해하는 Stateful / Stateless 차이](https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-Stateful-Stateless-%EC%A0%95%EB%A6%AC)
2. [Stateful, Stateless (웹서버 통신 방식)](https://junshock5.tistory.com/83)

# Stateful과 Stateless

- Stateful: 상태유지
- Stateless: 무상태

Stateful과 Stateless는 Client가 Server와의 연결을 유지하는지 유지하지 않는지를 나타내는 용어이다. 위 두가지 상태에 따라 동작 과정이 달라지게 된다. Client의 브라우저에 페이지가 전송된 후로 Server와 연결을 끊김없이 주고받지 않는다. 처음에 접속할 때 필요한 Data를 모두 받은 후 필요할 때 Server에게 요청하는 방식으로 동작한다. 이를 기억하면서 자세히 알아보자.

## Stateful

**Server가 Client의 상태(State)를 보존함을 의미한다.**

대표적으로 TCP 과정을 예로 들 수가 있다.

<img src="https://blog.kakaocdn.net/dn/qKOrf/btrRb8AbMO9/8jxRWApU7SHa3UEUNfCMA1/img.png"/>

Youtube에서 로그인 한 후 메인페이지를 보면 맞춤동영상이 나열되어 있을 것이다. 영상 하나를 클릭해서 영상 페이지를 접속하였더니 메인페이지에서 로그인하였던 내 정보가 그대로 유지되어 영상 페이지에서도 좋아요, 구독 기능 등을 사용할 수 있게 되었다. 이 과정을 한 스텝씩 살펴보자.

1. 메인페이지에서 로그인을 하여 메인페이지를 로딩할 때 내 정보가 같이 서버로부터 로드되어 브라우저에서 렌더링된다.
2. 동영상 하나를 클릭하여 새로운 페이지로 접속한다. 원래대로라면 새로운 페이지로 접속하였을 때 페이지 정보를 서버로부터 받아온다. 이때 페이지만 로드된다면 내 로그인 정보는 받아오지 못해 로그인정보가 유실되어 Guest상태의 페이지가 로드될 것이다.
3. 새로운 페이지를 로드하며 내 로그인 정보를 같이 로드하여 좋아요, 구독등을 이용할 수 있는 페이지를 이용할 수 있다.

3번 과정이 이루어지려면 페이지를 요청한 Client가 **로그인 중**이라는 정보를 Server에서 보관을하고 있어야 진행될 것이다. 또한 Client가 페이지를 요청할 때 본인의 정보를 Server에 전송하지 않는다면 이 Client가 방금 로그인했던 짱구인지 새로 접속한 맹구인지 Server가 알 수가 없다. 해당 동작 방식은 이후 다른 문서에 자세히 서술하겠다.

이러한 과정을 Session이 생성되어 Session이 유지되고있는 상태라고 할 수 있다. Client가 브라우저를 종료하거나 로그아웃하는 등 연결을 끊는다면 Session이 종료되었다라고 할 수 있다.

하지만 Stateful은 항상 장점만 지니고 있는건 아니다.

- 현재 접속중인 Client를 관장하고 있는 Server의 연결이 종료된다면 Session이 즉시 종료된다.

위의 이유로 인해 Stateful은 트래픽이 증가하거나 서버에 문제가 생겼을 때 서버의 증설, 변경을 어렵게한다. 하나의 Session을 다른 Server가 중간에 이어받을 수 없다.

## Stateless

**Server가 Client의 상태(State)를 보존하지 않음을 의미한다.**

대표적으로 UDP와 HTTP를 예로 들 수 있다.

<img src="https://blog.kakaocdn.net/dn/KuMV7/btrReERYp4P/ruR1YXroqbbAlunRqYizH1/img.png"/>

Stateful 구조에서는 서버가 Client를 기억하여 Session을 유지하고 관리하는 역할을 하였다. Stateless 구조는 Client의 상태를 기억하지 않고 Client가 오로지 통신에 필요한 상태 정보들을 모두 지니고 Server와 통신할 때 매번 데이터를 실어 보내어 Server에게 응답을 받는 구조이다.

Stateful에 비해 아래의 장점을 지니고 있다.

- Server의 Session 정보 저장공간에 대한 부하를 줄일 수 있다.
- 트래픽이 증가하였을 때 서버의 확장, 변경등을 수월하게 수행할 수 있다.

다만 항상 장점이 있는 것은 아니다.

- 요청시 Stateful에 비해 더 많은 데이터를 전송하여야한다. 따라서 많은 상태들이 얽혀있는 통신이라면 Client의 부하가 늘어나며, 상태를 Client에서 관리할 수 있기 때문에 보안관련 통신에서는 보안 취약점이 될 수 있다.

# 둘 중에 어느 것을 선택하여야 하나요?

Stateful은 Server의 부하를 늘리는 대신 Client의 부하를 줄인다.

Stateless는 Setver의 부하를 줄이는 대신 Client의 부하를 늘린다.

Client는 동시다발적으로 여러곳에서 접속하는 반면에 Server는 한 곳에서 한정된 자원으로 운용하므로 기본적으로 Stateless한 상태를 유지하는 것이 Server 측면에서는 최적의 방법이라고 할 수 있다. 하지만 로그인 세션기능의 이유가 있기에 최대한 Stateless한 방법을 유지하며 필요한 곳에 Stateful한 로직을 구현하는 것이 정답이라고 할 수 있다.

그러나 JWT Token 방식을 이용하면 로그인 상태 유지도 Stateless한 로직으로 구현할 수 있다! Token 방식은 다른 문서에 자세하게 서술하겠다..