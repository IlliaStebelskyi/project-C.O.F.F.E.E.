import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import instance, { setAccessToken } from "./api/instance";
import { logout, setCredential } from "./slices/authSlice";
import { getMe } from "./api/authApi";


function App() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const restoreSession = async () => {
            try {
                const response = await instance.post('/auth/refresh');
                const token = response.data.data.accessToken;
                setAccessToken(token);
                const userResponse = await getMe();
                dispatch(setCredential({ user: userResponse.data.data, token }));
            } catch {
                dispatch(logout());
            } finally {
                setIsLoading(false);
            }
        };
        restoreSession();
    }, [dispatch]);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/" element={<h1>Welcome to C.O.F.F.E.E.</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;