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
        return <p>Завантаження...</p>;
    }

    return (
        <div>
            <h1>Кошик</h1>

            {error && <p>{error}</p>}

            <ul>
                {cart.items.map((item) => (
                    <li key={item.productId}>
                        <p>{item.productName} — {item.price} грн</p>
                        <p>{item.isAvailable ? "Доступний" : "Недоступний"}</p>
                        <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                        />
                        {item.specialRequests && <p>Побажання: {item.specialRequests}</p>}
                        <button onClick={() => handleRemove(item.productId)}>Видалити</button>
                    </li>
                ))}
            </ul>

            <p>Сума: {cart.totalAmount}</p>

            <button onClick={handleClear}>Очистити кошик</button>
        </div>
    );
}