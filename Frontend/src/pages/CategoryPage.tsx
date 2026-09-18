import { useEffect, useState, type SubmitEventHandler } from "react";

import { createCategory, deleteCategory, getCategories, updateCategory, type Category } from "../api/categoryApi";


export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState("");

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch {
            setError("Failed to load categories.");
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

     const handleCreate: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            await createCategory({ name, isActive });
            setName("");
            setIsActive(true);
            loadCategories();
        } catch {
            setError("Failed to create category.");
        }
    };

    const handleToggleActive = async (category: Category) => {
        try {
            await updateCategory(category.id, { name: category.name, isActive: !category.isActive });
            loadCategories();
        } catch {
            setError("Failed to update category.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id);
            loadCategories();
        } catch {
            setError("Failed to delete category.");
        }
    };

    return (
        <div>
            <h1>Категорії</h1>

            <form onSubmit={handleCreate}>
                <input
                    placeholder="Назва категорії"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                    Активна
                </label>
                <button type="submit">Додати</button>
            </form>

            {error && <p>{error}</p>}

            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        {category.name} — {category.isActive ? "активна" : "неактивна"}
                        <button onClick={() => handleToggleActive(category)}>
                            {category.isActive ? "Деактивувати" : "Активувати"}
                        </button>
                        <button onClick={() => handleDelete(category.id)}>Видалити</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}