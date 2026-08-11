export const increaseStock = ({
  product,
  quantity,
  costPrice,
}) => {
  const stockBefore = product.currentStock;

  product.currentStock += quantity;

  product.costPrice = costPrice;

  const stockAfter = product.currentStock;

  return {
    stockBefore,
    stockAfter,
  };
};

export const decreaseStock = ({
  product,
  quantity,
}) => {
  if (product.currentStock < quantity) {
    throw new Error("Insufficient stock.");
  }

  const stockBefore = product.currentStock;

  product.currentStock -= quantity;

  const stockAfter = product.currentStock;

  return {
    stockBefore,
    stockAfter,
  };
};