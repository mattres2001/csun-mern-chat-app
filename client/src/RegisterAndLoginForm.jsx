import {useState, useContext} from "react";
import axios from "axios"
import {UserContext} from "./UserContext.jsx";
import './index.css'
import google from './assets/google.svg';
import apple from './assets/apple.svg';

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
        <div className="login-container">
            

            <h2 className="form-title">Log in with</h2>

            
            <div className="social-login">


                <button className="social-button">

                    <img src= {google} alt="Google" className="social-icon" />
                        Google

                 </button>

                <button className="social-button">

                        <img src={apple} alt="Apple" className="social-icon" />
                        Apple

                </button>


            </div>

            <p className="separator"><span>or</span></p>

            
            <form  action="#" className="login-form" onSubmit={handleSubmit}>
               
               <div className="input-wrapper">

                <input value={username} 
                       onChange={ev => setUsername(ev.target.value)} 
                       type="email" 
                       placeholder="Email address" 
                       className="input-field"/>

                <i className="material-symbols-rounded">mail</i>
                       
                </div>
                

                <div className="input-wrapper">

                <input value={password} 
                       onChange={ev => setPassword(ev.target.value)} 
                       type="password" 
                       placeholder="Password" 
                       className="input-field"/>

                <i className="material-symbols-rounded">lock</i>

               </div>
               
                <button className="login-button">
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
                
            
                
                <div className="text-center mt-2">
                    {isLoginOrRegister === 'register' && (


                        <p className="signup-text">
                        Already a member? 
                        <a href="#" onClick={() => setIsLoginOrRegister('login')}>
                            Login here
                        </a>
                        </p>    


                    )}
                    {isLoginOrRegister === 'login' && (


                        <p className="signup-text">
                            Don't have an account?
                            <a href="#" onClick={() => setIsLoginOrRegister('register')}>
                                Register
                            </a>
                        </p>


                    )}
                </div>


            </form> 


        </div>
    );
}