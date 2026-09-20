import { useEffect, useState } from "react";
import type { SubmitEventHandler } from "react";
import { getMyProfile, updateMyProfile, type UpdateProfileRequest, type UserProfile } from "../api/userApi";

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [preferences, setPreferences] = useState("");

    const loadProfile = async () => {
        try {
            const data = await getMyProfile();
            setProfile(data);
            setName(data.name);
            setLastName(data.lastName);
            setPhone(data.phone ?? "");
            setBirthDate(data.birthDate ?? "");
            setPreferences(data.preferences ?? "");
        } catch {
            setError("Failed to load profile.");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleUpdate: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            const request: UpdateProfileRequest = {
                name,
                lastName,
                phone: phone || null,
                birthDate: birthDate || null,
                preferences: preferences || null,
            };
            const updated = await updateMyProfile(request);
            setProfile(updated);
        } catch {
            setError("Failed to update profile.");
        }
    };

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center text-[#564a41] font-['Inter',system-ui,sans-serif]">
                <p>Завантаження...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfaf7] font-['Inter',system-ui,sans-serif] text-[#564a41]">
            <div className="max-w-[640px] mx-auto px-6 sm:px-8 py-10">
                <div className="flex items-center gap-4 mb-7">
                    <div className="w-14 h-14 rounded-full bg-[#221912] text-[#fbf6ef] flex items-center justify-center font-['Space_Grotesk',system-ui,sans-serif] font-semibold text-lg shrink-0">
                        {profile.name[0]}{profile.lastName[0]}
                    </div>
                    <div>
                        <h1 className="font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] text-xl font-bold m-0">Мій профіль</h1>
                        <p className="text-[13px] text-[#564a41] m-0 mt-0.5">Email: {profile.email}</p>
                        <p className="text-[13px] text-[#564a41] m-0">Роль: {profile.role}</p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="border border-[#e6ded2] rounded-[16px] p-5 sm:p-6 bg-white flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#201711]">Ім'я</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#201711]">Прізвище</label>
                        <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#201711]">Телефон</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#201711]">Дата народження</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#201711]">Побажання</label>
                        <input value={preferences} onChange={(e) => setPreferences(e.target.value)} className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]" />
                    </div>

                    {error && <p className="text-[13px] text-[#b8742e]">{error}</p>}

                    <button type="submit" className="bg-[#b8742e] hover:bg-[#a26426] text-white rounded-[10px] px-4 py-2 text-[13.5px] font-medium transition-colors cursor-pointer self-start">Зберегти</button>
                </form>
            </div>
        </div>
    );
}