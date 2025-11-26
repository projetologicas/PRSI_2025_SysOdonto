import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./app/Login.tsx";
import {Register} from "./app/Register.tsx";
import {Home} from "./app/Home.tsx";
import {useStoreToken} from "./features/user-features.ts";

function App() {
    const {token} = useStoreToken();


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>

            {token &&
                <Routes>
                    <Route path="/home" element={<Home/>}/>
                </Routes>
            }

        </BrowserRouter>
    );
}

export default App;
