import {useEffect, useState} from "react";

import Logo from "./Logo";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import Avatar from "./Avatar";


export default function Chat(){
    const[ws,setWs] = useState(null);
    const[onlinePeople, setOnlinePeople] = useState({});
    const[selectedUserId, setSelectedUserId] = useState(null);
    const{username, id} = useContext(UserContext);

    useEffect(() =>{
        const ws = new WebSocket('ws://localhost:4040');
        setWs(ws);
        ws.addEventListener('message', handleMessage)

    }, []);
    function showOnlinePeople(peopleArray){   //
        const people = {};
        peopleArray.forEach(({userId, username}) => {
            people[userId] = username;
        });    
        setOnlinePeople(people);

    }
    function handleMessage(ev){        //
        const messageData = JSON.parse(ev.data);
        if('online' in messageData){
            showOnlinePeople(messageData.online);
        }
    }

    //Fix this to show only other users
 const onlinePeopleExclOurUser = {...onlinePeople};
 console.log(delete onlinePeopleExclOurUser[id]);

    return (  // Change colors to reflect CSUN
        <div className="flex h-screen"> 
            <div className="bg-white w-1/3"> 
            <Logo />
                {Object.keys(onlinePeopleExclOurUser).map(userId => (  // Avatars will be created right above onlinePeople[userId]
                    <div key = {userId} onClick={() => setSelectedUserId(userId)} 
                            className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer " + (userId === selectedUserId ? 'bg-blue-50' : '')}> 
                       {userId === selectedUserId && (
                            <div className= "w-1 bg-blue-500 h-12 rounded-r-md"></div>
                       )}
                       <div className="flex gap-2 py-2 pl-4 items-center">
                       <Avatar username={onlinePeople[userId]} userId={userId}/>
                        <span className="text-gray-800">{onlinePeople[userId]} </span> 
                        </div>
                        </div>
                ))}
            </div>
          
            
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
            <div className="flex-grow">
                {!selectedUserId && (
                    <div className="flex h-full flex-grow items-center justify-center">
                        <div className="text-gray-300">&larr; Select a person</div>
                        </div>
                )}
            </div>
            <div className = "flex gap-2">
                <input type="text" 
                    placeholder= "Type your message here"
                    className="bg-white flex-grow border rounded-sm p-2" />
                <button className = "bg-blue-500 p-2 text-white rounded-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>

                </button>
            </div>
            </div>

             </div>
    );


}