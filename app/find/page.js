import Styles from './find.module.css'
import DongariInList from './DongariInList';

const GetClubs = async () => {
  const URL = 'http://localhost:3000';
  const rows = await fetch(URL+'/api/clubs', {
    method: "GET"
  });
  const jsonData = await rows.json();

  return jsonData;
}

export default async function Home() {
  const Groups = await GetClubs();
  console.log(Groups);

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
          Groups.map((club,index)=>{
            return(
              <DongariInList 
                name={club.clubName} 
                department={club.department}
                oneLine={club.oneLine}
                short={club.short}
                isRecruiting={club.isRecruiting}
                period={club.recruitPeriod}
                people={club.recruitTarget}
                pageURL={club.pageURL}
                image={club.image}
                i={index} 
                key={club.clubid}
              />
            );
          })
        }
      </div>
    </div>
  )
}
