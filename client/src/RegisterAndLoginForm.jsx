import {useState, useContext} from "react";
import axios from "axios"
import {UserContext} from "./UserContext.jsx";

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
        <div className="bg-blue-50 h-screen flex items-center">
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
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
                <div className="text-center mt-2">
                    {isLoginOrRegister === 'register' && (
                        <div>
                        Already a member? 
                        <button onClick={() => setIsLoginOrRegister('login')}>
                            Login here
                        </button>
                        </div>    
                    )}
                    {isLoginOrRegister === 'login' && (
                        <div>
                            Don't have an account?
                            <button onClick={() => setIsLoginOrRegister('register')}>
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </form> 
        </div>
    );
}