
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
        <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center px-6 py-10 font-['Inter',system-ui,sans-serif] text-[#564a41]">
            <div className="w-full max-w-[380px]">
                <h1 className="font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] text-[26px] font-bold m-0 mb-6 text-center">Реєстрація</h1>

                <form onSubmit={handleSubmit(sendData)} className="border border-[#e6ded2] rounded-[16px] bg-white p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-[13px] font-medium text-[#201711]">Ім'я</label>

                        <input
                            id="name"
                            type="text"
                            autoComplete="given-name"
                            {...register("name")}
                            className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]"
                        />

                        {errors.name && (
                            <p className="text-[12.5px] text-[#b8742e] m-0">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="lastName" className="text-[13px] font-medium text-[#201711]">Прізвище</label>

                        <input
                            id="lastName"
                            type="text"
                            autoComplete="family-name"
                            {...register("lastName")}
                            className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]"
                        />

                        {errors.lastName && (
                            <p className="text-[12.5px] text-[#b8742e] m-0">{errors.lastName.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-[13px] font-medium text-[#201711]">Email</label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            {...register("email")}
                            className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]"
                        />

                        {errors.email && (
                            <p className="text-[12.5px] text-[#b8742e] m-0">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-[13px] font-medium text-[#201711]">Пароль</label>

                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            {...register("password")}
                            className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]"
                        />

                        {errors.password && (
                            <p className="text-[12.5px] text-[#b8742e] m-0">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="confirmPassword" className="text-[13px] font-medium text-[#201711]">
                            Підтвердження пароля
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            {...register("confirmPassword")}
                            className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]"
                        />

                        {errors.confirmPassword && (
                            <p className="text-[12.5px] text-[#b8742e] m-0">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {error && <p className="text-[13px] text-[#b8742e] m-0">{error}</p>}

                    <button type="submit" disabled={isSubmitting} className="bg-[#b8742e] hover:bg-[#a26426] disabled:opacity-60 text-white rounded-[10px] py-2.5 text-[14px] font-medium transition-colors cursor-pointer">
                        {isSubmitting
                            ? "Реєстрація..."
                            : "Зареєструватись"}
                    </button>

                    <p className="text-[13px] text-[#564a41] text-center m-0">
                        Вже є акаунт?{" "}
                        <Link to="/login" className="text-[#b8742e] hover:text-[#a26426] font-medium">
                            Увійти
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

