"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import useCategories from "@/lib/firestore/categories/read";
import { Edit2, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { deleteCategory } from "@/lib/firestore/categories/write";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export default function ListView() {
  const { data: categories, error, isLoading } = useCategories();

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-red-500">Error loading categories</p>
      </div>
    );

  return (
    <div className="flex flex-1 flex-col gap-2 rounded-xl md:pr-10 md:pl-5">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <AiOutlineLoading3Quarters size={50} className="animate-spin" />
        </div>
      ) : (
        <>
          <h1 className="text-lg font-semibold">Categories</h1>

          <div className="w-full overflow-x-auto whitespace-nowrap">
            <table className="min-w-full border-separate border-spacing-y-2 text-sm md:text-base">
              <thead>
                <tr className="bg-white dark:bg-gray-800">
                  <th className="rounded-l-lg border-l px-4 py-2 md:p-2">SN</th>
                  <th className="px-4 py-2 whitespace-nowrap md:p-2">Image</th>
                  <th className="px-4 py-2 text-left whitespace-nowrap md:p-2">
                    Name
                  </th>
                  <th className="rounded-r-lg border-r px-4 py-2 md:p-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((category: Category, index: number) => (
                  <Row key={category.id} item={category} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ item, index }: { item: Category; index: number }) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();

  const handleUpdate = () => {
    router.push(`/admin/categories?id=${item.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setIsDeleting(true);
    try {
      await deleteCategory({ id: item.id });
      toast.success("Category deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error: " + error.message);
      }
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.");
    }
    setIsDeleting(false);
  };

  return (
    <tr key={item.id} className="bg-white text-center dark:bg-gray-800">
      <td className="rounded-l-lg border-l px-4 py-2 md:p-2">{index + 1}</td>
      <td className="px-4 py-2 md:p-2">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={40}
          height={40}
          className="mx-auto h-8 w-8 rounded-md object-cover md:h-10 md:w-10"
        />
      </td>
      <td className="max-w-[120px] truncate px-4 py-2 text-left whitespace-nowrap md:p-2">
        {item.name}
      </td>
      <td className="rounded-r-lg border-r px-4 py-2 md:p-2">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={isDeleting}
            onClick={handleUpdate}
          >
            <Edit2 />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
          </Button>
        </div>
      </td>
    </tr>
  );
}
