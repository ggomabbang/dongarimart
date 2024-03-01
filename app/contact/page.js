import Styles from './contact.module.css';

export default function contact() {
  return (
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>Contact</h1>
      <div className={Styles.Input}>
        <h2 className={Styles.Title}>연락처</h2>
        <div className={Styles.ContactLink}>
          <p className={Styles.Mail}>dongarimart@gmail.com</p>
          <a className={Styles.KaKao} href='https://open.kakao.com/o/gbE4EXcg' target='_blank'>
            <img src='https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/5f9c58c2017800001.png'/>
            오픈 카톡 바로가기
          </a>
        </div>
        <h3 className={Styles.Title}>공통</h3>
        <ul>
          <li>불건전, 서비스 악용 등의 사용자 신고</li>
          <li>서비스 불편, 개선 사항</li>
          <li>기타 문의 사항</li>
        </ul>
        <h3 className={Styles.Title}>동아리 관련 문의</h3>
        <p>아래 사항은 동아리를 등록했던 계정의 이메일로 이메일 발신 부탁드립니다!</p>
        <ul>
          <li>동아리 이름 변경</li>
          <li>동아리 편집 소유권 이전</li>
        </ul>
        <h3 className={Styles.Title}>계정 관련 문의</h3>
        <p>오픈카톡을 이용하시면 더 빠른 답장을 받아보실 수 있습니다!</p>
        <ul>
          <li>비밀번호 초기화</li>
          <li>닉네임 변경 등</li>
        </ul>
      </div>
    </div>
  )
}