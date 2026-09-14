
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    registerSchema,
    type RegisterFormData,
} from "../../utils/ValidationSchemas";

import { register as registerUser, getMe } from "../../api/authApi";
import { setCredential } from "../../slices/authSlice";

export default function RegisterPage() {
    const [error, setError] = useState<string>("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const sendData = async (data: RegisterFormData) => {
        setError("");

        try {
            const { confirmPassword, ...requestData } = data;

            const token = await registerUser(requestData);

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
                "Не вдалося зареєструвати акаунт."
            );
        }
    };

    return (
        <div>
            <h1>Реєстрація</h1>

            <form onSubmit={handleSubmit(sendData)}>
                <div>
                    <label htmlFor="name">Ім'я</label>

                    <input
                        id="name"
                        type="text"
                        autoComplete="given-name"
                        {...register("name")}
                    />

                    {errors.name && (
                        <p>{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="lastName">Прізвище</label>

                    <input
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        {...register("lastName")}
                    />

                    {errors.lastName && (
                        <p>{errors.lastName.message}</p>
                    )}
                </div>

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
                        autoComplete="new-password"
                        {...register("password")}
                    />

                    {errors.password && (
                        <p>{errors.password.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword">
                        Підтвердження пароля
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                    />

                    {errors.confirmPassword && (
                        <p>{errors.confirmPassword.message}</p>
                    )}
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? "Реєстрація..."
                        : "Зареєструватись"}
                </button>

                <p>
                    Вже є акаунт?{" "}
                    <Link to="/login">
                        Увійти
                    </Link>
                </p>
            </form>
        </div>
    );
}

