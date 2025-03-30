import { z } from "zod";

export const formSchema = (isUpdate: boolean) =>
  z.object({
    "category-image": isUpdate
      ? z.custom<File | undefined>().optional()
      : z
          .custom<File | undefined>(
            (file) => file instanceof File,
            "File is required.",
          )
          .refine(
            (file) =>
              !file ||
              ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
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
