
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "../../api/authApi";
import { setCredential } from "../../slices/authSlice";
import { loginSchema, type LoginFormData } from "../../utils/ValidationSchemas";
import { getMe } from "../../api/authApi";

export default function LoginPage() {
    const [error, setError] = useState<string>("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const sendData = async (data: LoginFormData) => {
        setError("");

        try {
            const token = await login(data);

            const userResponse = await getMe();

            dispatch(
                setCredential({
                    user: userResponse.data.data,
                    token,
                })
            );

            navigate("/");
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Невірний email або пароль."
            );
        }
    };

    return (
        <div>
            <h1>Вхід в акаунт</h1>

            <form onSubmit={handleSubmit(sendData)}>
                <div>
                    <label htmlFor="email">Email</label>

                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        {...register("email")}
                    />

                    {errors.email && (
                        <p>{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password">Пароль</label>

                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        {...register("password")}
                    />

                    {errors.password && (
                        <p>{errors.password.message}</p>
                    )}
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Вхід..." : "Увійти"}
                </button>

                <p>
                    Немає акаунту?{" "}
                    <Link to="/register">
                        Зареєструватись
                    </Link>
                </p>
            </form>
        </div>
    );
}

