import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./app/Login.tsx";
import {Register} from "./app/Register.tsx";
import {FormPacient} from "./app/FormPacient.tsx";
import {useStoreToken} from "./features/user-features.ts";
import {FormConsultation} from "./app/FormConsultation.tsx";
import {PatientList} from "./app/PatientList.tsx";

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
                    <Route path="/formconsultation" element={<FormConsultation/>}/>
                    <Route path="/patients" element={<PatientList />} />
                    <Route path="/patients/new" element={<FormPacient />} />
                    <Route path="/patients/update/:id" element={<FormPacient />} />
                </Routes>
            }

        </BrowserRouter>
    );
}

export default App;
