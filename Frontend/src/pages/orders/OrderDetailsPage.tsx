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
        return (
            <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center text-[#b8742e] font-['Inter',system-ui,sans-serif]">
                <p>{error}</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center text-[#564a41] font-['Inter',system-ui,sans-serif]">
                <p>Завантаження...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfaf7] font-['Inter',system-ui,sans-serif] text-[#564a41]">
            <div className="max-w-[640px] mx-auto px-6 sm:px-8 py-10">
                <h1 className="font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] text-3xl font-bold m-0 mb-4">Замовлення #{order.id}</h1>
                <div className="border border-[#e6ded2] rounded-[16px] bg-white p-5">
                    <p className="text-[13px] text-[#564a41] m-0">Статус: {order.status}</p>
                    <p className="text-[13px] text-[#564a41] m-0">Час самовивозу: {order.expectedPickupTime}</p>
                    <p className="text-[13px] text-[#564a41] m-0 mb-3">Створено: {order.createdAt}</p>

                    <ul className="border-t border-[#e6ded2] pt-3 flex flex-col gap-1.5 list-none m-0 p-0">
                        {order.items.map((item) => (
                            <li key={item.productId} className="text-[13px] text-[#201711]">
                                {item.productName} — {item.quantity} шт. по {item.currentPrice}
                                {item.specialRequests && <span className="text-[#564a41]"> ({item.specialRequests})</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}