import DongariInList from '../find/DongariInList';
import Styles from './my.module.css';

export default function My() {
  return (
    <div className={Styles.Content}>
      <div className={Styles.InputPanel}>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이름</p>
          <div className={Styles.Right}>
            <input 
            value={'파이썬헤이러'}
            className={Styles.InputBox} 
            readOnly
            id='name_box'
            />
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이메일</p>
          <div className={Styles.Right}>
            <input 
            value={'pythonhater@pusan.ac.kr'}
            className={Styles.InputBox} 
            readOnly
            id='name_box'
            />
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li id={'email_check'}>인증된 이메일 ✅</li>
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>비밀번호</p>
          <div className={Styles.Right}>
            <button className={Styles.BlueButton}>비밀번호 변경하기</button>
          </div>
        </div>

      </div>

      <div className={Styles.DongariPanel}>
        <div className={Styles.Top}>
          <h1 className={Styles.Title}>관리중인 동아리 🔧</h1>
        </div>
        <DongariInList name={'동아리 명'} i={1}/>
        <div className={Styles.ButtonSpace}>
          <button className={Styles.BlueButton}>관리하기</button>
        </div>
      </div>

      <div className={Styles.DongariPanel}>
        <div className={Styles.Top}>
          <h1 className={Styles.Title}>소속된 동아리 📌</h1>
        </div>
        <DongariInList name={'동아리 A'} i={2}/>
      </div>
    </div>
  )
}