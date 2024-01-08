import Styles from './recruit.module.css';

export default function Recruit() {
  return (
    <div className={Styles.Panel}>
      <div className={Styles.Input}>
        
        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 기간</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              type='date'
              id='recruitStart'
            />
            ~
            <input
              className={Styles.InputBox}
              type='date'
              id='recruitEnd'
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>신청 링크</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              placeholder='구글 폼, 자체 신청사이트 링크 등'
              id='recruitURL'
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 인원</p>
          <div className={Styles.RightEditable}>
            <button className={Styles.AddButton}>
              역할 추가 +
            </button>
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 글</p>
          <div className={Styles.Right}>
            <textarea 
              className={Styles.LargeInputBox}
              placeholder='모집 공고 본문'
              id='content'
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>이미지</p>
          <div className={Styles.Right}>
            <img className={Styles.ImageBox}/>
            <div className={Styles.Buttons}>
              <label className={Styles.UploadButton} htmlFor='input-file'>
                업로드
              </label>
              <input 
                id="input-file"
                type="file"
                accept='image/png, image/jpeg'
                style={{display: "none"}}
              >
              </input>
              <button className={Styles.CancelButton}>취소</button>
            </div>
          </div>
        </lable>

        <button className={Styles.UploadButton}>
          완료
        </button>

      </div>
    </div>
  )
}