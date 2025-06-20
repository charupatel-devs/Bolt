export const addProduct = async (productData) => {
  try {
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Error adding product: " + error.message);
  }
};
