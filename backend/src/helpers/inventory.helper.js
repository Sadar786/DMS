import InventoryLog from "../models/InventoryLog.js"

export const createInventoryLog = async ({
  session,
  product,
  type,
  reason,
  quantity,
  stockBefore,
  stockAfter,
  referenceId,
  referenceModel,
  remarks,
  createdBy,
}) => {
  await InventoryLog.create(
    [
      {
        product,
        type,
        reason,
        quantity,
        stockBefore,
        stockAfter,
        referenceId,
        referenceModel,
        remarks,
        createdBy,
      },
    ],
    { session }
  );
};