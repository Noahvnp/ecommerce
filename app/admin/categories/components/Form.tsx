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
import { useRef, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { createCategory } from "@/lib/firestore/categories/write";
import { toast } from "react-toastify";

const formSchema = z.object({
  "category-image": z
    .custom<File | undefined>(
      (file) => file instanceof File,
      "File is required.",
    )
    .refine(
      (file) =>
        !file || ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      "Must be a png, jpeg, or jpg.",
    )
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Max file size is 5MB.",
    ),
  "category-name": z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  "category-slug": z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
});

export default function CategoryForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "category-image": undefined,
      "category-name": "",
      "category-slug": "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values["category-image"]) {
      console.error("No image selected");
      return;
    }

    setIsLoading(true);
    const result = await createCategory({
      name: values["category-name"],
      slug: values["category-slug"],
      image: values["category-image"],
    });

    if (result.success) {
      toast.success("Category created successfully!");
      form.reset();
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsLoading(false);
    } else {
      toast.error("Error: " + result.error);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl bg-white p-5 md:w-[33%] dark:bg-gray-800">
      <h1 className="font-semibold">Create Category</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Upload Image */}
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
                    onChange={(e) => {
                      const file = e.target.files?.[0] || undefined;
                      form.setValue("category-image", file, {
                        shouldValidate: true,
                      });
                      setPreviewImage(file ? URL.createObjectURL(file) : null);
                    }}
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

          {/* Category Name */}
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

          {/* Category Slug */}
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
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
}
