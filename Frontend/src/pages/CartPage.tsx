import { useEffect, useState } from "react";
import { clearCart, getCart, removeCartItem, updateCartItem, type Cart } from "../api/Cart";


export default function CartPage() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [error, setError] = useState("");

    const loadCart = async () => {
        try {
            const data = await getCart();
            setCart(data);
        } catch {
            setError("Failed to load cart.");
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleQuantityChange = async (productId: string, quantity: number) => {
        try {
            const updated = await updateCartItem(productId, { quantity, specialRequests: null });
            setCart(updated);
        } catch {
            setError("Failed to update item.");
        }
    };

    const handleRemove = async (productId: string) => {
        try {
            const updated = await removeCartItem(productId);
            setCart(updated);
        } catch {
            setError("Failed to remove item.");
        }
    };

    const handleClear = async () => {
        try {
            await clearCart();
            loadCart();
        } catch {
            setError("Failed to clear cart.");
        }
    };

    if (!cart) {
        return (
            <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center text-[#564a41] font-['Inter',system-ui,sans-serif]">
                <p>Завантаження...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfaf7] font-['Inter',system-ui,sans-serif] text-[#564a41]">
            <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-10">
                <h1 className="font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] text-3xl font-bold m-0 mb-6">Кошик</h1>

                {error && <p className="text-[13px] text-[#b8742e] mb-4">{error}</p>}

                <ul className="border border-[#e6ded2] rounded-[16px] bg-white divide-y divide-[#e6ded2] list-none m-0 p-0 mb-6">
                    {cart.items.map((item) => (
                        <li key={item.productId} className="flex flex-wrap items-center gap-3 p-4">
                            <div className="flex-1 min-w-[160px]">
                                <p className="text-[14px] font-semibold text-[#201711] m-0">{item.productName} — {item.price} грн</p>
                                <p className="text-[12px] m-0 mt-0.5 text-[#564a41]">{item.isAvailable ? "Доступний" : "Недоступний"}</p>
                                {item.specialRequests && <p className="text-[12px] text-[#564a41] m-0 mt-0.5">Побажання: {item.specialRequests}</p>}
                            </div>
                            <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                                className="border border-[#e6ded2] rounded-[10px] px-2 py-1.5 text-[13px] w-16 outline-none focus:border-[#b8742e]"
                            />
                            <button onClick={() => handleRemove(item.productId)} className="text-[#564a41]/70 hover:text-[#b8742e] text-[12.5px] font-medium cursor-pointer">Видалити</button>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center justify-between border border-[#e6ded2] rounded-[16px] p-5 bg-white">
                    <p className="text-[15px] font-semibold text-[#201711] m-0">Сума: {cart.totalAmount}</p>
                    <button onClick={handleClear} className="border border-[#e6ded2] hover:border-[#b8742e] text-[#201711] rounded-[10px] px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer">Очистити кошик</button>
                </div>
            </div>
        </div>
    );
}