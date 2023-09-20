import Notice from './notice';

export default function NoticePage() {
  return (
    <div 
      className='Container' 
      style={{
        marginTop: '50px',
        marginBottom: '50px',
        width: '80%'
      }}
    >
      <Notice more={'none'}/>
    </div>
  )
}