import {createContext, useState, useEffect} from "react";
import axios from "axios";

// Create a React Context that will store user information globally 
//  across entire React app
export const UserContext = createContext({});

// UserContextProvider provides user info to all children components
export function UserContextProvider({children}) {
    // Set username and user id as React States to keep track of
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);

    // Check if User is logged in by submitting GET form to /profile
    useEffect(() => {
        axios.get('/profile').then(response => {
            setId(response.data.userID);
            setUsername(response.data.username);
        });
    }, []);
    
    // Pass user data to children components within UserContextProvider
    return (
        <UserContext.Provider value={{username, setUsername, id, setId}}>
            {children}
        </UserContext.Provider>
    );

}