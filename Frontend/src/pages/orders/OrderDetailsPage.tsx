import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api/order";
import type { Order } from "../../api/order";

export default function OrderDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState("");

    const loadOrder = async () => {
        if (!id) return;
        try {
            const data = await getOrderById(id);
            setOrder(data);
        } catch {
            setError("Failed to load order.");
        }
    };

    useEffect(() => {
        loadOrder();
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!order) {
        return <p>Завантаження...</p>;
    }

    return (
        <div>
            <h1>Замовлення #{order.id}</h1>
            <p>Статус: {order.status}</p>
            <p>Час самовивозу: {order.expectedPickupTime}</p>
            <p>Створено: {order.createdAt}</p>

            <ul>
                {order.items.map((item) => (
                    <li key={item.productId}>
                        {item.productName} — {item.quantity} шт. по {item.currentPrice}
                        {item.specialRequests && <span> ({item.specialRequests})</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}