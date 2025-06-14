import {useContext} from "react";
import {UserContext} from "./UserContext";
import RegisterAndLoginForm from "./RegisterAndLoginForm";


export default function Routes() {
    const {username, id} = useContext(UserContext);

    if (username){
        return "Logged in!" + username;
    }

    return (
        // If not logged in, route to RegisterAndLoginForm
        <RegisterAndLoginForm/>
    );
}