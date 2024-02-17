const schedule = require('node-schedule');

schedule.scheduleJob('0 0 0 * * *', async () => {
  const result = await fetch('http://localhost:3000/api/cron', {
    method: 'DELETE'
  });
  if (result.status == 204) console.log('isRecruit resetting success');
  else console.log('isRecruit resetting error');
});