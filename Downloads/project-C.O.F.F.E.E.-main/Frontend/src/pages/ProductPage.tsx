import { useEffect, useState } from "react";
import type { SubmitEventHandler } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct, type Product, type ProductRequest } from "../api/product";
import { getCategories, type Category } from "../api/categoryApi";
import { addCartItem } from "../api/Cart";


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [categoryId, setCategoryId] = useState("");

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch {
            setError("Failed to load products.");
        }
    };

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch {
            setError("Failed to load categories.");
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const handleCreate: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            const request: ProductRequest = {
                name,
                description,
                price,
                imageUrl,
                isAvailable,
                categoryId,
            };
            await createProduct(request);
            setName("");
            setDescription("");
            setPrice(0);
            setImageUrl("");
            setIsAvailable(true);
            setCategoryId("");
            loadProducts();
        } catch {
            setError("Failed to create product.");
        }
    };

    const handleToggleAvailable = async (product: Product) => {
        try {
            await updateProduct(product.id, {
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl,
                isAvailable: !product.isAvailable,
                categoryId: product.categoryId,
            });
            loadProducts();
        } catch {
            setError("Failed to update product.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id);
            loadProducts();
        } catch {
            setError("Failed to delete product.");
        }
    };

    const handleAddToCart = async (productId: string) => {
        try {
            await addCartItem({ productId, quantity: 1, specialRequests: null });
        } catch {
            setError("Failed to add to cart.");
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfaf7] font-['Inter',system-ui,sans-serif] text-[#564a41]">
            <div className="max-w-[1080px] mx-auto px-6 sm:px-8 py-10">
                <h1 className="font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] text-3xl font-bold m-0 mb-6">Товари</h1>

                <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 mb-8 border border-[#e6ded2] rounded-[16px] p-5 bg-white">
                    <input
                        placeholder="Назва"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e] flex-1 min-w-[140px]"
                    />
                    <input
                        placeholder="Опис"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e] flex-1 min-w-[160px]"
                    />
                    <input
                        type="number"
                        placeholder="Ціна"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e] w-24"
                    />
                    <input
                        placeholder="URL зображення"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e] flex-1 min-w-[160px]"
                    />
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]">
                        <option value="">Оберіть категорію</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <label className="flex items-center gap-2 text-[13.5px] text-[#201711] pb-2">
                        <input
                            type="checkbox"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            className="accent-[#b8742e]"
                        />
                        Доступний
                    </label>
                    <button type="submit" className="bg-[#b8742e] hover:bg-[#a26426] text-white rounded-[10px] px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer">Додати товар</button>
                </form>

                {error && <p className="text-[13px] text-[#b8742e] mb-4">{error}</p>}

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none m-0 p-0">
                    {products.map((product) => (
                        <li key={product.id} className="border border-[#e6ded2] rounded-[16px] bg-white overflow-hidden flex flex-col">
                            <div className="h-32 bg-gradient-to-br from-[#efe6d8] to-[#e6ded2] flex items-center justify-center overflow-hidden">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl opacity-60">☕</span>
                                )}
                            </div>
                            <div className="p-4 flex flex-col gap-1 flex-1">
                                <p className="text-[15px] font-semibold text-[#201711] m-0">{product.name}</p>
                                <p className="text-[12.5px] text-[#564a41] m-0">{product.description}</p>
                                <p className="text-[14px] font-semibold text-[#201711] m-0 mt-1">Ціна: {product.price}</p>
                                <p className="text-[12px] text-[#564a41] m-0">Категорія: {product.categoryName}</p>
                                <p className="text-[12px] m-0 font-medium">{product.isAvailable ? "Доступний" : "Недоступний"}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <button onClick={() => handleAddToCart(product.id)} className="bg-[#b8742e] hover:bg-[#a26426] text-white rounded-[10px] px-3 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer">Додати в кошик</button>
                                    <button onClick={() => handleToggleAvailable(product)} className="border border-[#e6ded2] hover:border-[#b8742e] text-[#201711] rounded-[10px] px-3 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer">
                                        {product.isAvailable ? "Деактивувати" : "Активувати"}
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="text-[#564a41]/70 hover:text-[#b8742e] text-[12.5px] font-medium cursor-pointer">Видалити</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}