import prisma from '@/prisma/prisma'

function getFormatDate(date){
  var year = date.getFullYear();              //yyyy
  var month = (1 + date.getMonth());          //M
  month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
  var day = date.getDate();                   //d
  day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
  return  year + '-' + month + '-' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
}

export async function DELETE(request) {
  const clubs = await prisma.ClubList.updateMany({
    where: {
      schedule: {
        recruitEnd: {
          lt: new Date(getFormatDate(new Date()))
        }
      }
    },
    data: {
      isRecruiting: false
    }
  })
  console.log(clubs);
  const target = await prisma.RecruitSchedule.deleteMany({
    where: {
      recruitEnd: {
        lt: new Date(getFormatDate(new Date())),
      }
    },
  });
  console.log(target);

  return new Response(null, {
    status: 204,
  })
}