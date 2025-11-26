import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./app/Login.tsx";
import {Register} from "./app/Register.tsx";
import {FormPacient} from "./app/FormPacient.tsx";
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
                    <Route path="/formpacient" element={<FormPacient/>}/>
                </Routes>
            }

        </BrowserRouter>
    );
}

export default App;
