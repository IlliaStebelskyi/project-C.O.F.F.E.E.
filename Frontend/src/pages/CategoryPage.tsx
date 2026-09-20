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
        <div className="min-h-screen bg-[#fcfaf7] font-['Inter',system-ui,sans-serif] text-[#564a41]">
            <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-10">
                <h1 className="font-['Space_Grotesk',system-ui,sans-serif] text-[#201711] text-3xl font-bold m-0 mb-6">Категорії</h1>

                <form onSubmit={handleCreate} className="flex flex-wrap items-center gap-3 mb-6 border border-[#e6ded2] rounded-[16px] p-4 bg-white">
                    <input
                        placeholder="Назва категорії"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 min-w-[180px] border border-[#e6ded2] rounded-[10px] px-3 py-2 text-[13.5px] outline-none focus:border-[#b8742e]"
                    />
                    <label className="flex items-center gap-2 text-[13.5px] text-[#201711]">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="accent-[#b8742e]"
                        />
                        Активна
                    </label>
                    <button type="submit" className="bg-[#b8742e] hover:bg-[#a26426] text-white rounded-[10px] px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer">Додати</button>
                </form>

                {error && <p className="text-[13px] text-[#b8742e] mb-4">{error}</p>}

                <ul className="border border-[#e6ded2] rounded-[16px] bg-white divide-y divide-[#e6ded2] list-none m-0 p-0">
                    {categories.map((category) => (
                        <li key={category.id} className="flex items-center justify-between gap-3 p-4 text-[14px] text-[#201711]">
                            <span>{category.name} — {category.isActive ? "активна" : "неактивна"}</span>
                            <span className="flex items-center gap-2 shrink-0">
                                <button onClick={() => handleToggleActive(category)} className="border border-[#e6ded2] hover:border-[#b8742e] text-[#201711] rounded-[10px] px-3 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer">
                                    {category.isActive ? "Деактивувати" : "Активувати"}
                                </button>
                                <button onClick={() => handleDelete(category.id)} className="text-[#564a41]/70 hover:text-[#b8742e] text-[12.5px] font-medium cursor-pointer">Видалити</button>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}