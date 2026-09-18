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
        return <p>Завантаження...</p>;
    }

    return (
        <div>
            <h1>Мій профіль</h1>

            <p>Email: {profile.email}</p>
            <p>Роль: {profile.role}</p>

            <form onSubmit={handleUpdate}>
                <div>
                    <label>Ім'я</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div>
                    <label>Прізвище</label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div>
                    <label>Телефон</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div>
                    <label>Дата народження</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                </div>

                <div>
                    <label>Побажання</label>
                    <input value={preferences} onChange={(e) => setPreferences(e.target.value)} />
                </div>

                {error && <p>{error}</p>}

                <button type="submit">Зберегти</button>
            </form>
        </div>
    );
}