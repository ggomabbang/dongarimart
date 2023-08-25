import Styles from './find.module.css'
import DongariInList from './DongariInList';

export default function Home() {
  let Groups = ['거위', '삼겹살', '말미잘','고양이',] //동아리 정보 데이터베이스 불러오기
  return (
    <div className={Styles.Vertical_Div}>
      <div className={Styles.Horizontal_Div}>
        <input className={Styles.SearchBar} placeholder='검색해보세요 !' style={{marginLeft:'3%'}}/>
        <select className={Styles.MenuFont} style={{width:'18vw', background:'transparent', marginLeft:'1%', marginRight:'3%', marginBottom:'1%', border:'none'}}>
          <option value={"cse"}>과-정보컴퓨터공학부</option>
          <option value={"mt"}>과-목탁제조학과</option>
          <option value={"dp"}>과-강아지심리학</option>
        </select>
        <h4 style={{paddingTop:'1%', paddingLeft:'.3%', marginRight:'3%', width:'7px', height:'33px', background:'grey'}} ></h4>
        <select className={Styles.MenuFont} style={{width:'10vw' , background:'transparent', border:'none', marginBottom:'1%'}}>
          <option value={"name"}>이름순</option>
          <option value={"recruit"}>모집중</option>
          <option value={"hoho"}>허허</option>
        </select>
      </div>
      <div>
      {
      Groups.map((a,i)=>{
        return(
          <DongariInList a={a} i={i} key={i}/>
        );
      })
      }</div>
    </div>
  )
}
