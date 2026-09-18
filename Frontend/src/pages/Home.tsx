import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProducts, type Product } from "../api/product";
import { addToCart } from "../slices/cartSlice";
import type { AppDispatch } from "../slices/index";

const FALLBACK_PRODUCTS: Product[] = [
    { id: "1", categoryId: "c1", categoryName: "Кава", name: "Капучино", description: "Еспресо з ніжною молочною пінкою.", price: 75, imageUrl: "", isAvailable: true },
    { id: "2", categoryId: "c1", categoryName: "Кава", name: "Латте", description: "М'який еспресо з великою кількістю молока.", price: 80, imageUrl: "", isAvailable: true },
    { id: "3", categoryId: "c1", categoryName: "Кава", name: "Еспресо", description: "Класична міцна кава.", price: 40, imageUrl: "", isAvailable: true },
    { id: "4", categoryId: "c1", categoryName: "Кава", name: "Флет Вайт", description: "Подвійний еспресо з гарячим молоком.", price: 85, imageUrl: "", isAvailable: true },
    { id: "6", categoryId: "c2", categoryName: "Чай", name: "Чорний чай", description: "Класичний листовий чай.", price: 45, imageUrl: "", isAvailable: true },
    { id: "11", categoryId: "c3", categoryName: "Холодні напої", name: "Айс капучино", description: "Холодна кава з льодом.", price: 85, imageUrl: "", isAvailable: true },
    { id: "16", categoryId: "c4", categoryName: "Десерти", name: "Вівсяне печиво", description: "Зі шматочками шоколаду.", price: 35, imageUrl: "", isAvailable: true },
    { id: "17", categoryId: "c4", categoryName: "Десерти", name: "Круасан", description: "Класичний масляний круасан.", price: 55, imageUrl: "", isAvailable: true },
];

const CATEGORIES = [
    { id: "all", label: "Усе" },
    { id: "Кава", label: "Кава" },
    { id: "Чай", label: "Чай" },
    { id: "Холодні напої", label: "Холодні напої" },
    { id: "Десерти", label: "Десерти" },
];

export default function HomePage() {
    const dispatch = useDispatch<AppDispatch>();
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data && data.length > 0 ? data : FALLBACK_PRODUCTS);
            } catch (err) {
                setProducts(FALLBACK_PRODUCTS);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart({ productId: product.id, quantity: 1 }));
    };

    const filteredProducts = activeCategory === "all"
        ? products
        : products.filter((p) => p.categoryName && p.categoryName.toLowerCase() === activeCategory.toLowerCase());

    return (
        <div className="max-w-[1080px] mx-auto px-4 sm:px-8 pt-8 pb-16">
            <div className="mb-7">
                <h1 className="font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] text-3xl font-bold m-0">Обери напій</h1>
                <p className="mt-1.5 text-[14px] text-[#564a41]">Робот приготує його, поки ти йдеш до кіоску.</p>
            </div>

            {/* Кнопки категорій */}
            <div className="flex gap-2.5 overflow-x-auto pb-6 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full border text-[13px] font-medium transition-colors cursor-pointer ${
                            activeCategory === cat.id
                                ? "border-[#201711] bg-[#201711] text-[#fbf6ef]"
                                : "border-[#e6ded2] bg-[#fcfaf7] text-[#201711] hover:border-[#201711]"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-20 text-[#564a41]">Завантаження каталогу...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredProducts.map((item) => (
                        <div key={item.id} className="border border-[#e6ded2] rounded-[16px] overflow-hidden flex flex-col bg-white hover:shadow-md transition-all">
                            <div className="h-[130px] w-full bg-gradient-to-br from-[#efe6d8] to-[#e6ded2] flex items-center justify-center text-4xl">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>☕</span>
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-1 gap-1.5">
                                <div className="text-[15px] font-semibold text-[#201711]">{item.name}</div>
                                <div className="text-[12.5px] text-[#564a41] leading-snug flex-1">{item.description}</div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-[15px] font-semibold text-[#201711]">{item.price} ₴</span>
                                    <button 
                                        onClick={() => handleAddToCart(item)}
                                        className="bg-[#b8742e] hover:bg-[#a26426] text-white rounded-[10px] px-3.5 py-2 text-[13px] font-medium transition-colors cursor-pointer"
                                    >
                                        Додати
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}