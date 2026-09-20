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
        <div className="min-h-screen bg-[#fcfaf7] font-['Inter',system-ui,sans-serif] text-[#564a41]">
            <div className="max-w-[880px] mx-auto px-6 sm:px-8 py-10">
                <h1 className="font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] text-3xl font-bold m-0 mb-6">Усі замовлення (адмін)</h1>

                {error && <p className="text-[13px] text-[#b8742e] mb-4">{error}</p>}

                <ul className="flex flex-col gap-4 list-none m-0 p-0">
                    {orders.map((order) => (
                        <li key={order.id} className="border border-[#e6ded2] rounded-[16px] bg-white p-5">
                            <p className="text-[14.5px] font-semibold text-[#201711] m-0">Замовлення #{order.id}</p>
                            <p className="text-[12.5px] text-[#564a41] m-0 mt-1">UserId: {order.userId}</p>
                            <p className="text-[12.5px] text-[#564a41] m-0">Статус: {order.status}</p>
                            <p className="text-[12.5px] text-[#564a41] m-0">Сума: {order.totalAmount}</p>
                            <p className="text-[12.5px] text-[#564a41] m-0 mb-3">Час самовивозу: {order.expectedPickupTime}</p>
                            <ul className="border-t border-[#e6ded2] pt-3 mb-3 flex flex-col gap-1.5 list-none m-0 p-0">
                                {order.items.map((item) => (
                                    <li key={item.productId} className="text-[13px] text-[#201711]">
                                        {item.productName} — {item.quantity} шт. по {item.currentPrice}
                                        {item.specialRequests && <span className="text-[#564a41]"> ({item.specialRequests})</span>}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleUpdateStatus(order.id, "Confirmed")} className="bg-[#b8742e] hover:bg-[#a26426] text-white rounded-[10px] px-3 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer">
                                    Підтвердити
                                </button>
                                <button onClick={() => handleUpdateStatus(order.id, "Cancelled")} className="border border-[#e6ded2] hover:border-[#b8742e] text-[#201711] rounded-[10px] px-3 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer">
                                    Скасувати
                                </button>
                                <button onClick={() => handleDelete(order.id)} className="text-[#564a41]/70 hover:text-[#b8742e] text-[12.5px] font-medium cursor-pointer">Видалити</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}