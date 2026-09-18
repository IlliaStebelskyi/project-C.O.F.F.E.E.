import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../api/authApi";
import { setCredential } from "../../slices/authSlice";
import type { AppDispatch } from "../../slices/index";

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ email, password });
            dispatch(setCredential({ 
                user: { email, name: "Користувач", lastName: "", role: "Client", phone: null, birthDate: null, preferences: null }, 
                token: "active-token" 
            }));
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Помилка входу. Перевір дані.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center px-4 font-['Inter',system-ui,sans-serif] text-[#564a41]">
            <div className="w-full max-w-[960px] bg-white border border-[#e6ded2] rounded-[24px] overflow-hidden shadow-sm flex flex-col md:flex-row">
                
                {/* Ліва брендована панель */}
                <div className="md:w-[42%] bg-[#201711] text-[#fbf6ef] p-8 sm:p-12 flex flex-col justify-between">
                    <div>
                        {/* Логотип зі смужками */}
                        <div className="flex items-center gap-2.5 text-[20px] font-bold font-['Space_Grotesk',system-ui,sans-serif] tracking-wide text-white">
                            <div className="flex items-center gap-[4px] h-6">
                                <span className="inline-block w-[3px] h-3.5 bg-[#b8742e] rounded-full transform -rotate-12"></span>
                                <span className="inline-block w-[3px] h-5 bg-[#b8742e] rounded-full transform -rotate-12"></span>
                                <span className="inline-block w-[3px] h-3.5 bg-[#b8742e] rounded-full transform -rotate-12"></span>
                            </div>
                            <span>C.O.F.F.E.E.</span>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk',system-ui,sans-serif] mb-3">
                            З поверненням
                        </h2>
                        <p className="text-[13.5px] text-[#e6ded2]/80 leading-relaxed">
                            Увійди, та замовляйте каву без черги!
                        </p>
                    </div>
                </div>

                {/* Права частина з формою */}
                <div className="md:w-[58%] p-8 sm:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] mb-2">
                        Вхід до аккаунта
                    </h3>
                    <p className="text-[13.5px] text-[#564a41] mb-8">
                        Введіть свої облікові дані для продовження.
                    </p>

                    {error && (
                        <div className="mb-4 p-3 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-[13px]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-[13px] font-medium text-[#201711] mb-1.5">Email</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 rounded-[12px] border border-[#e6ded2] focus:border-[#201711] focus:outline-none text-[14px] text-[#201711] bg-[#fcfaf7]/50"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-[#201711] mb-1.5">Пароль</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-[12px] border border-[#e6ded2] focus:border-[#201711] focus:outline-none text-[14px] text-[#201711] bg-[#fcfaf7]/50"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="mt-2 w-full bg-[#b8742e] hover:bg-[#a26426] text-white rounded-[12px] py-3 text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Вхід..." : "Увійти"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-[13.5px] text-[#564a41]">
                        Ще немає аккаунта?{" "}
                        <Link to="/register" className="text-[#b8742e] font-medium hover:underline">
                            Зареєструватися
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}