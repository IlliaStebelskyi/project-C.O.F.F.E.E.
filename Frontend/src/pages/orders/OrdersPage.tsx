import { useEffect, useState } from "react";
import type { SubmitEventHandler } from "react";
import { createOrder, deleteOrder, getMyOrders, type CreateOrderRequest, type Order } from "../../api/order";
import { getProducts, type Product } from "../../api/product";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState("");

    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [expectedPickupTime, setExpectedPickupTime] = useState("");

    const loadOrders = async () => {
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch {
            setError("Failed to load orders.");
        }
    };

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch {
            setError("Failed to load products.");
        }
    };

    useEffect(() => {
        loadOrders();
        loadProducts();
    }, []);

    const handleCreate: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            const request: CreateOrderRequest = {
                items: [
                    {
                        productId,
                        quantity,
                        specialRequests: null,
                    },
                ],
                expectedPickupTime,
            };
            await createOrder(request);
            setProductId("");
            setQuantity(1);
            setExpectedPickupTime("");
            loadOrders();
        } catch {
            setError("Failed to create order.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteOrder(id);
            loadOrders();
        } catch {
            setError("Failed to delete order.");
        }
    };

    return (
        <div>
            <h1>Мої замовлення</h1>

            <form onSubmit={handleCreate}>
                <select value={productId} onChange={(e) => setProductId(e.target.value)}>
                    <option value="">Оберіть товар</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name} — {product.price}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Кількість"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <input
                    type="datetime-local"
                    value={expectedPickupTime}
                    onChange={(e) => setExpectedPickupTime(e.target.value)}
                />
                <button type="submit">Створити замовлення</button>
            </form>

            {error && <p>{error}</p>}

            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <p>Замовлення #{order.id}</p>
                        <p>Статус: {order.status}</p>
                        <p>Час самовивозу: {order.expectedPickupTime}</p>
                        <ul>
                            {order.items.map((item) => (
                                <li key={item.productId}>
                                    {item.productName} — {item.quantity} шт. по {item.currentPrice}
                                    {item.specialRequests && <span> ({item.specialRequests})</span>}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handleDelete(order.id)}>Видалити</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}