import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, logout } from '../slices/authSlice';
import { logoutRequest } from '../api/authApi';

export default function ProfilePage() {
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Заглушка на випадок тестування без піднятого бекенду / логіну
    const user = currentUser || {
        name: "Гість",
        lastName: "",
        email: "guest@example.com",
        role: "Client",
        phone: "+380 (99) 000-00-00",
        birthDate: "01.01.2000",
        preferences: "Капучино"
    };

    const handleLogout = async () => {
        try {
            await logoutRequest();
        } catch (error) {
            console.error("Помилка при виході на сервері", error);
        } finally {
            dispatch(logout());
            navigate('/login');
        }
    };

    return (
        <div className="max-w-[700px] mx-auto px-4 sm:px-8 pt-10 pb-16">
            <div className="flex items-center gap-6 mb-10">
                <div className="w-[80px] h-[80px] rounded-full bg-[#201711] text-[#fbf6ef] flex items-center justify-center text-2xl font-bold uppercase">
                    {user.name?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[#201711]">{user.name} {user.lastName}</h1>
                    <span className="inline-block mt-1 bg-[#efe6d8] text-[#b8742e] text-[12px] font-medium px-2.5 py-0.5 rounded-full">
                        {user.role === 'Admin' ? 'Адміністратор' : 'Клієнт'}
                    </span>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="ml-auto text-red-500 hover:text-red-700 font-medium text-[14px] transition-colors cursor-pointer"
                >
                    Вийти
                </button>
            </div>

            <div className="border border-[#e6ded2] rounded-[16px] bg-white p-6 sm:p-8">
                <h2 className="font-semibold text-[#201711] mb-6">Особисті дані</h2>
                
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-[#fcfaf7]">
                        <span className="w-[200px] text-[14px] text-[#564a41] mb-1 sm:mb-0">Email</span>
                        <span className="font-medium text-[#201711]">{user.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-[#fcfaf7]">
                        <span className="w-[200px] text-[14px] text-[#564a41] mb-1 sm:mb-0">Телефон</span>
                        <span className="font-medium text-[#201711]">{user.phone || 'Не вказано'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-[#fcfaf7]">
                        <span className="w-[200px] text-[14px] text-[#564a41] mb-1 sm:mb-0">Дата народження</span>
                        <span className="font-medium text-[#201711]">{user.birthDate || 'Не вказано'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center py-3">
                        <span className="w-[200px] text-[14px] text-[#564a41] mb-1 sm:mb-0">Улюблені напої</span>
                        <span className="font-medium text-[#201711]">{user.preferences || 'Не вказано'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}