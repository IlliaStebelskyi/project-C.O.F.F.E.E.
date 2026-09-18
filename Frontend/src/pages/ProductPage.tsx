import { useEffect, useState } from "react";
import type { SubmitEventHandler } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct, type Product, type ProductRequest } from "../api/product";
import { getCategories, type Category } from "../api/categoryApi";


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

    return (
        <div>
            <h1>Товари</h1>

            <form onSubmit={handleCreate}>
                <input
                    placeholder="Назва"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    placeholder="Опис"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Ціна"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <input
                    placeholder="URL зображення"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Оберіть категорію</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <label>
                    <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                    />
                    Доступний
                </label>
                <button type="submit">Додати товар</button>
            </form>

            {error && <p>{error}</p>}

            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <p>{product.name}</p>
                        <p>{product.description}</p>
                        <p>Ціна: {product.price}</p>
                        <p>Категорія: {product.categoryName}</p>
                        <p>{product.isAvailable ? "Доступний" : "Недоступний"}</p>
                        <button onClick={() => handleToggleAvailable(product)}>
                            {product.isAvailable ? "Деактивувати" : "Активувати"}
                        </button>
                        <button onClick={() => handleDelete(product.id)}>Видалити</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}