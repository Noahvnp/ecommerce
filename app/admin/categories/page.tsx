"use client";

import CategoryForm from "./components/Form";
import ListView from "./components/ListView";

export default function Page() {
  return (
    <main className="flex flex-col gap-5 md:flex-row">
      <CategoryForm />
      <ListView />
    </main>
  );
}
