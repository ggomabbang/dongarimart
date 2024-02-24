import Styles from './contact.module.css';

export default function contact() {
  return (
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>Contact</h1>
      <div className={Styles.Input}>
        <h2 className={Styles.Title}>연락 가능한 이메일</h2>
        <p>dongarimart@gmail.com</p>
        <ul>
          <li>불건전, 서비스 악용 등의 사용자 신고</li>
          <li>서비스 불편, 개선 사항</li>
          <li>문의 사항</li>
          <li>동아리 이름 변경</li>
          <li>동아리 편집 소유권 이전 등</li>
        </ul>
      </div>
    </div>
  )
}