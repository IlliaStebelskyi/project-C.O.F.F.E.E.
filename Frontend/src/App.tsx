import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import HomePage from "./pages/Home";
import CartPage from "./pages/Cart";
import ProfilePage from "./pages/Profile";
import { AppLayout } from "./components/AppLayout";
import { RequireAuth } from "./components/RequireAuth";
import instance, { setAccessToken } from "./api/instance";
import { logout, setCredential } from "./slices/authSlice";
import { getMe } from "./api/authApi";
import type { AppDispatch } from "./slices/index";


function App() {
    const dispatch = useDispatch<AppDispatch>();
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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    element={
                        <RequireAuth>
                            <AppLayout />
                        </RequireAuth>
                    }
                >
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
