export default function DongariInList({a, i}) {
    return (
        <div className='Div_Fold' id={"div"+i} style={{marginTop:'1%'}}>
            <div className='Hor_Div'>
              <h4 className='Title' style={{position:'absolute', marginTop:'1%', marginLeft:'2%'}}>{a}</h4>
              <h className='SubTitle' style={{position:'absolute',marginTop:'4.5%', marginLeft:'26%'}}>부제목</h>
              <button className='SeeButton' id={'seebtn'+i} style={{position:'absolute', marginLeft:'68%', marginTop:'4%'}} onClick={()=>{
                if(document.getElementById("div"+i).style.height != "85vh"){
                  document.getElementById("seebtn"+i).style.rotate = "90deg"
                  document.getElementById("div"+i).style.height = "85vh";
                  document.getElementById("img"+i).style.display = "block";
                  document.getElementById("info"+i).style.display = "block";
                  document.getElementById("info2"+i).style.display = "block";
                  document.getElementById("info3"+i).style.display = "block";
                  document.getElementById("info4"+i).style.display = "block";
                }
                else{
                  document.getElementById("seebtn"+i).style.rotate = "-90deg"
                  document.getElementById("div"+i).style.height = "26vh";
                  document.getElementById("img"+i).style.display = "none";
                  document.getElementById("info"+i).style.display = "none";
                  document.getElementById("info2"+i).style.display = "none";
                  document.getElementById("info3"+i).style.display = "none";
                  document.getElementById("info4"+i).style.display = "none";
                }
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2.5vh" height="4vh" viewBox="0 0 18 33" fill="none">
                <path d="M17 1.5L2 16.5L17 31.5" stroke="black" stroke-width=".3vh"/>
                </svg>
                </button>
            </div>
            <br/><br/><br/><br/>
            <div className='Hor_Div' style={{marginLeft:'2.5%'}}>
                <h4 className='Tag' style={{marginTop:'2%', fontSize:'30px', textAlign:'center', fontStyle:'normal', letterSpacing:'3px'}}>태그</h4>
                <h4 className='Tag' style={{marginTop:'2%', marginLeft:'1%', fontSize:'30px', textAlign:'center', fontStyle:'normal', letterSpacing:'3px'}}>태그2</h4>
              </div>
            <div  className='Hor_Div'>
              <img id={"img"+i}className='ClubImage' style={{position:'absolute', marginLeft:'2%'}}/>
              <h4 id={"info"+i} className='InfoText' style={{ marginLeft:'40%'}}>소개글</h4>
            </div>
            <h4 id={"info2"+i} className='BlueButton' style={{marginLeft:'40%'}}>모집기간</h4>
            <h4 id={"info3"+i}className='BlueButton'style={{marginLeft:'40%'}}>세부인원</h4>
            <button id={"info4"+i} className='BlueButton' style={{marginLeft:'70%', marginTop:'-2%', width:'30vh', height:'7vh'}}>자세히보기</button>
          </div>
    )
}