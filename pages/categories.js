import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [name, setName] = useState("");
  //   Fetching all the categories
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    await axios.post("/api/categories", { name, parentCategory });
    setName("");
    fetchCategories();
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>New Category Name</label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder={"Category name"}
          onChange={(ev) => setName(ev.target.value)}
          value={name}
        />
        <select
          className="mb-0"
          onChange={(ev) => setParentCategory(ev.target.value)}
          value={parentCategory}
        >
          <option value="">No Parent Category</option>
          {/* all the categories we have */}
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        <button type={"submit"} className="btn-primary py-1 ">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>ParentCategory</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                    <button className="btn-primary ml-1">Edit</button>
                    <button className="btn-primary ml-1">Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
