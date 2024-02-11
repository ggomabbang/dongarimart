import Notice from './notice';

export default function noticePage() {
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