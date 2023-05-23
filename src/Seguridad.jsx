
import App from './App';
import { useSelector } from 'react-redux';
import { Login } from './Login';
export const Seguridad = () => {
   const { loggedIn} = useSelector((state) => state.appsesion);
  //  console.log(counter, 'esto es en seguridad');
  return (
    <>
        {loggedIn ? <App /> : <Login/>}
    </>
    
  )
}
