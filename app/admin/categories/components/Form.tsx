"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  createCategory,
  updateCategory,
} from "@/lib/firestore/categories/write";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { formSchema } from "@/lib/validation/categorySchema";

export default function CategoryForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const searhParams = useSearchParams();
  const id: string = searhParams.get("id") || "";

  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(!!id)),
    defaultValues: {
      "category-image": undefined,
      "category-name": "",
      "category-slug": "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategory({ id: id });
        if (!res) toast.error("Category not found");
        else {
          form.setValue("category-name", res.name);
          form.setValue("category-slug", res.slug);
          setPreviewImage(res.imageUrl);
        }
      } catch (error) {
        toast.error("Error: " + error);
      }
    };

    if (id) fetchData();
  }, [id, form]);

  async function onSubmit(values: z.infer<ReturnType<typeof formSchema>>) {
    setIsLoading(true);

    try {
      if (id) {
        //Update Category
        const existingCategory = await getCategory({ id });

        if (!existingCategory) {
          toast.error("Category not found!");
          return;
        }

        const result = await updateCategory({
          id,
          name: values["category-name"],
          slug: values["category-slug"],
          image: values["category-image"] || existingCategory.imageUrl,
        });

        if (result.success) {
          toast.success("Category updated successfully!");
          resetForm();
          router.replace("/admin/categories");
        } else {
          toast.error("Error: " + result.error);
        }
      } else {
        //Create Category
        if (values["category-image"]) {
          const result = await createCategory({
            name: values["category-name"],
            slug: values["category-slug"],
            image: values["category-image"],
          });

          if (result.success) {
            toast.success("Category created successfully!");
            resetForm();
            setIsLoading(false);
          } else {
            toast.error("Error: " + result.error);
          }
        }
      }
    } catch (error) {
      toast.error("Error: " + error);
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    form.reset();
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || undefined;
    form.setValue("category-image", file, { shouldValidate: true });
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  }

  return (
    <div className="flex w-full flex-col gap-5 rounded-xl bg-white p-5 md:w-[33%] dark:bg-gray-800">
      <h1 className="font-semibold">{id ? "Update" : "Create"} Category</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="category-image"
            render={() => (
              <FormItem>
                <FormLabel className="flex gap-1">
                  Image<span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {previewImage && (
            <div className="relative mx-auto w-32">
              <Image
                src={previewImage}
                alt="Preview"
                width={128}
                height={128}
                className="h-auto w-full rounded-md object-cover"
              />
              <button
                type="button"
                className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white transition-all hover:bg-red-600"
                onClick={() => {
                  form.setValue("category-image", undefined, {
                    shouldValidate: true,
                  });
                  setPreviewImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}

          <FormField
            control={form.control}
            name="category-name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-1">
                  Name<span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category-slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-1">
                  Slug<span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter Slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            {id ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
