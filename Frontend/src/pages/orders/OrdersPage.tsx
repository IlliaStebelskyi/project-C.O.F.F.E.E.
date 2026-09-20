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
        <div className="min-h-screen bg-[#fcfaf7] font-['Inter',system-ui,sans-serif] text-[#564a41]">
            <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-10">
                <h1 className="font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] text-3xl font-bold m-0 mb-6">Мої замовлення</h1>

                <form onSubmit={handleCreate} className="flex flex-wrap items-center gap-3 mb-8 border border-[#e6ded2] rounded-[16px] p-4 bg-white">
                    <select value={productId} onChange={(e) => setProductId(e.target.value)} className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e] flex-1 min-w-[180px]">
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
                        className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e] w-28"
                    />
                    <input
                        type="datetime-local"
                        value={expectedPickupTime}
                        onChange={(e) => setExpectedPickupTime(e.target.value)}
                        className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]"
                    />
                    <button type="submit" className="bg-[#b8742e] hover:bg-[#a26426] text-white rounded-[10px] px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer">Створити замовлення</button>
                </form>

                {error && <p className="text-[13px] text-[#b8742e] mb-4">{error}</p>}

                <ul className="flex flex-col gap-4 list-none m-0 p-0">
                    {orders.map((order) => (
                        <li key={order.id} className="border border-[#e6ded2] rounded-[16px] bg-white p-5">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[14.5px] font-semibold text-[#201711] m-0">Замовлення #{order.id}</p>
                                <button onClick={() => handleDelete(order.id)} className="text-[#564a41]/70 hover:text-[#b8742e] text-[12.5px] font-medium cursor-pointer">Видалити</button>
                            </div>
                            <p className="text-[12.5px] text-[#564a41] m-0">Статус: {order.status}</p>
                            <p className="text-[12.5px] text-[#564a41] m-0 mb-3">Час самовивозу: {order.expectedPickupTime}</p>
                            <ul className="border-t border-[#e6ded2] pt-3 flex flex-col gap-1.5 list-none m-0 p-0">
                                {order.items.map((item) => (
                                    <li key={item.productId} className="text-[13px] text-[#201711]">
                                        {item.productName} — {item.quantity} шт. по {item.currentPrice}
                                        {item.specialRequests && <span className="text-[#564a41]"> ({item.specialRequests})</span>}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}