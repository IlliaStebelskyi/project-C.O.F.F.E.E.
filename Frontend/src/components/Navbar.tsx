import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logoutRequest } from '../api/authApi';
import { logout, selectCurrentUser } from '../slices/authSlice';
import { fetchCart, resetCart, selectCartItemCount } from '../slices/cartSlice';
import type { AppDispatch } from '../slices/index';

/**
 * Logic only, styled with smooth hover effects & precise logo spacing.
 */
export function Navbar() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const cartItemCount = useSelector(selectCartItemCount);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            await logoutRequest();
        } catch {
            // ignore
        } finally {
            dispatch(logout());
            dispatch(resetCart());
            navigate('/login');
        }
    };

    return (
        <nav className="max-w-[1080px] mx-auto px-4 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-[#e6ded2]">
            
            {/* Логотип: при наведенні іконка стає повністю чорною, текст — брендовим коричневим */}
            <Link 
                to="/" 
                className="group flex items-center gap-2.5 text-[20px] font-bold font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] transition-colors duration-200"
            >
                <div className="flex items-center gap-[4px] h-6 text-[#b8742e] group-hover:text-[#201711] transition-colors duration-200">
                    <span className="inline-block w-[3px] h-3.5 bg-current rounded-full transform -rotate-12"></span>
                    <span className="inline-block w-[3px] h-5 bg-current rounded-full transform -rotate-12"></span>
                    <span className="inline-block w-[3px] h-3.5 bg-current rounded-full transform -rotate-12"></span>
                </div>
                <span className="group-hover:text-[#b8742e] transition-colors duration-200">
                    C.O.F.F.E.E.
                </span>
            </Link>

            {/* Навігація з блідішими посиланнями */}
            <div className="flex gap-6 items-center">
                <Link 
                    to="/" 
                    className="text-[14.5px] font-medium text-[#564a41]/70 hover:text-[#201711] transition-colors duration-200"
                >
                    Головна
                </Link>
                
                <Link 
                    to="/cart" 
                    className="text-[14.5px] font-medium text-[#564a41]/70 hover:text-[#201711] transition-colors duration-200 flex items-center gap-1.5"
                >
                    <span>Кошик</span>
                    {cartItemCount > 0 && (
                        <span className="bg-[#b8742e] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            {cartItemCount}
                        </span>
                    )}
                </Link>

                <Link 
                    to="/profile" 
                    className="text-[14.5px] font-medium text-[#564a41]/70 hover:text-[#201711] transition-colors duration-200"
                >
                    Профіль
                </Link>

                {user && (
                    <button 
                        onClick={handleLogout}
                        className="text-[14.5px] font-medium text-red-400 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                    >
                        Вийти
                    </button>
                )}
            </div>
        </nav>
    );
}