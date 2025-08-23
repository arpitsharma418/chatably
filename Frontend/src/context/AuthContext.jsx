import { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie";


export const AuthContext = createContext();

function AuthProvider({children}){

    const intialUserState = Cookies.get("token") || localStorage.getItem("userInfo");

    const [authUser, setAuthUser] = useState(intialUserState? JSON.parse(intialUserState) : null);
    
    return(
        <>
        <AuthContext.Provider value={{authUser, setAuthUser}}>
            {children}
        </AuthContext.Provider>
        </>
    )
}

const useAuth= () => {
    return useContext(AuthContext);
}

export {useAuth, AuthProvider};