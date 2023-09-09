import Styles from './find.module.css'
import DongariInList from './DongariInList';

export default function Home() {
  let Groups = ['거위', '삼겹살', '말미잘','고양이',] //동아리 정보 데이터베이스 불러오기
  return (
    <div className={Styles.Vertical_Div}>
      <div className={Styles.Horizontal_Div}>
        <input className={Styles.SearchBar} placeholder='검색해보세요 !'/>
        <div className={Styles.Selector}>
          <select className={Styles.MenuFont}>
            <option value={"cse"}>과-정보컴퓨터공학부</option>
            <option value={"mt"}>과-목탁제조학과</option>
            <option value={"dp"}>과-강아지심리학</option>
          </select>
          <select className={Styles.MenuFont}>
            <option value={"name"}>이름순</option>
            <option value={"recruit"}>모집중</option>
            <option value={"hoho"}>허허</option>
          </select>
        </div>
        
      </div>
      <div className={Styles.ListBox}>
        {
        Groups.map((a,i)=>{
          return(
            <DongariInList name={a} i={i} key={i}/>
          );
        })
        }
      </div>
    </div>
  )
}
