import Notice from './notice';

export default function NoticePage() {
  return (
    <div 
      className='Container' 
      style={{
        width: '900px'
      }}
    >
      <Notice more={'none'}/>
    </div>
  )
}