import {useState, useContext} from "react";
import axios from "axios"
import {UserContext} from "./UserContext.jsx";
import { GoogleLogin } from '@react-oauth/google';
import logo from './assets/chatapp_logo.png';

export default function RegisterAndLoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
    const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);

  
  
    function isCSUNemail(email){
        const emailRequire = /^[a-zA-Z0-9._%+-]+@my.csun\.edu$/;
        return emailRequire.test(email);
    }
 

    // Event when user submits credentials
    async function handleSubmit(ev) {
        // Prevent page from refreshing
        ev.preventDefault();

        if(!isCSUNemail(username)){
            alert("Please use a valid CSUN account.");
            return;
        }


        // Use axios to send HTTP request to backend /register or /login and 
        //  responds with a JWT cookie and JSON. App saves username and id globally
        //  using UserContext. User is then automatically 'logged in' on front end
        const url = isLoginOrRegister === 'register' ? 'register' : 'login';

        try{
        const {data} = await axios.post(url, {username, password});
        
        setLoggedInUsername(username);
        setId(data.id);
        }

        catch(error){
            console.error("Error during submission: ", error);
        };
        
    }

    // Login/Register page HTML/CSS
    return (
        <div className="h-screen items-center">
            <div className="w-96 h-96 mx-auto">
                <img width="auto" src={logo} alt="Chat App Logo"/>
            </div>
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                <input value={username} 
                       onChange={ev => setUsername(ev.target.value)} 
                       type="text" 
                       placeholder="username" 
                       className="block w-full rounded-sm p-2 mb-2 border"/>
                <input value={password} 
                       onChange={ev => setPassword(ev.target.value)} 
                       type="password" 
                       placeholder="password" 
                       className="block w-full rounded-sm p-2 mb-2 border"/>
                <button style={{ border: '5px solid rgb(210, 32, 48)' }} 
                        className="text-black font-bold block w-full rounded-sm p-2">
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
                <div className="text-center mt-2">
                    {isLoginOrRegister === 'register' && (
                        <div>
                        Already a member?{" "}
                        <button onClick={() => setIsLoginOrRegister('login')}>
                            <a className="text-blue-500 underline">Login here</a>
                        </button>
                        </div>    
                    )}
                    {isLoginOrRegister === 'login' && (
                        <div>
                            Don't have an account? {" "}
                            <button onClick={() => setIsLoginOrRegister('register')}>
                                <a className="text-blue-500 underline">Register</a>
                            </button>
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <GoogleLogin
                        onSuccess={async credentialResponse => {
                            console.log('Google Login Success:', credentialResponse);
                            try {
                                const response = await axios.post('/google-login', {
                                    token: credentialResponse.credential,
                                });
                                const { username, userId } = response.data;
                                setLoggedInUsername(username);
                                setId(userId);
                                // window.location.reload();
                            } catch (err) {
                                console.error('Google login failed:', err)
                                alert('Google login failed (server-side)');
                            }
                        }}
                        onError={() => {
                            console.log('Google Login Failed (Google-side)');
                        }}
                    />
                </div>
            </form> 
        </div>
    );
}