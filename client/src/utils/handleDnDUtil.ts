import type { Test } from "../types";

export const handleDnDUtil = (
  startIndex: number,
  endIndex: number,
  items: Test["questions"] | Test["questions"][number]["answers"],
) => {
  if (items) {
    const updatedItems = [...items];
    const draggedItem = updatedItems[startIndex];
    updatedItems.splice(startIndex, 1);
    updatedItems.splice(endIndex, 0, draggedItem);
    return updatedItems;
  }
};
