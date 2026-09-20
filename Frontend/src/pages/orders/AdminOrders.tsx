import { useEffect, useState } from "react";
import { deleteOrder, getAllOrders, updateOrderStatus, type Order } from "../../api/order";


export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState("");

    const loadOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch {
            setError("Failed to load orders.");
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateOrderStatus(id, status);
            loadOrders();
        } catch {
            setError("Failed to update order status.");
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
            <h1>Усі замовлення (адмін)</h1>

            {error && <p>{error}</p>}

            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <p>Замовлення #{order.id}</p>
                        <p>UserId: {order.userId}</p>
                        <p>Статус: {order.status}</p>
                        <p>Сума: {order.totalAmount}</p>
                        <p>Час самовивозу: {order.expectedPickupTime}</p>
                        <ul>
                            {order.items.map((item) => (
                                <li key={item.productId}>
                                    {item.productName} — {item.quantity} шт. по {item.currentPrice}
                                    {item.specialRequests && <span> ({item.specialRequests})</span>}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handleUpdateStatus(order.id, "Confirmed")}>
                            Підтвердити
                        </button>
                        <button onClick={() => handleUpdateStatus(order.id, "Cancelled")}>
                            Скасувати
                        </button>
                        <button onClick={() => handleDelete(order.id)}>Видалити</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}