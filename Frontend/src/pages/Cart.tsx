import { useSelector, useDispatch } from 'react-redux';
import { selectCart, removeFromCart } from '../slices/cartSlice';
import type { AppDispatch } from '../slices/index';

export default function CartPage() {
    const cart = useSelector(selectCart);
    const dispatch = useDispatch<AppDispatch>();

    // Перевірка на порожній кошик
    const isEmpty = !cart || !cart.items || cart.items.length === 0;

    return (
        <div className="max-w-[1080px] mx-auto px-4 sm:px-8 pt-10 pb-16">
            <h1 className="font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] text-3xl font-bold mb-8">Кошик</h1>

            {isEmpty ? (
                <div className="border border-[#e6ded2] rounded-[16px] bg-white p-10 text-center flex flex-col items-center">
                    <span className="text-5xl mb-4">🛒</span>
                    <div className="text-[16px] font-medium text-[#201711] mb-1">Твій кошик порожній</div>
                    <div className="text-[14px] text-[#564a41]">Час обрати улюблений напій!</div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 flex flex-col gap-4">
                        {cart.items.map((item) => (
                            <div key={item.productId} className="border border-[#e6ded2] rounded-[16px] bg-white p-4 flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-[#201711]">{item.productName}</div>
                                    <div className="text-[13px] text-[#564a41]">Кількість: {item.quantity}</div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="font-semibold text-[#201711]">{item.price * item.quantity} ₴</div>
                                    <button 
                                        onClick={() => dispatch(removeFromCart(item.productId))}
                                        className="text-red-500 hover:text-red-700 text-[13px] font-medium transition-colors cursor-pointer"
                                    >
                                        Видалити
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full lg:w-[320px] border border-[#e6ded2] rounded-[16px] bg-white p-6 h-fit">
                        <h2 className="font-semibold text-[#201711] mb-4">Разом</h2>
                        <div className="flex justify-between mb-2 text-[14px] text-[#564a41]">
                            <span>Товари ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                            <span>{cart.totalAmount} ₴</span>
                        </div>
                        <div className="flex justify-between mb-6 text-[14px] text-[#564a41]">
                            <span>Сервісний збір</span>
                            <span>0 ₴</span>
                        </div>
                        <div className="flex justify-between mb-6 text-[16px] font-bold text-[#201711]">
                            <span>До сплати</span>
                            <span>{cart.totalAmount} ₴</span>
                        </div>
                        <button className="w-full bg-[#b8742e] hover:bg-[#a26426] text-white rounded-[10px] px-4 py-3 text-[14px] font-medium transition-colors cursor-pointer">
                            Оформити замовлення
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}