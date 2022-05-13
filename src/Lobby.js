import logo from './logo.png'
const Lobby = ({username, roomName, handleUsernameChange, handleRoomNameChange, handleSubmit}) => {

  return(
    <div className="lobby">
      <img src={logo}></img>
      <h3>Completa los campos para unirte a tu daily</h3>
      <form className='form' onSubmit={handleSubmit}>
        <label>Tu nombre:</label>
        <input id='username' type='text' placeholder='Ingresa tu nombre' value={username} onChange={handleUsernameChange} required />
        <label>Tu daily:</label>
        <input id='room' type='text' placeholder='Ingresa el nombre de la sala' value={roomName} onChange={handleRoomNameChange} required />

        <button type='submit'>Unirme</button>
        
      </form>

    </div>

  )
}

export default Lobby