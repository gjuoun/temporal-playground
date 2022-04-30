import { Context } from "@temporalio/activity";

export async function purchase(id: string) {
  console.log(`purchase ${id}`);
  return Context.current().info.activityId;
}

export async function checkoutItem(itemId: string): Promise<string> {
  return `checking out ${itemId}!`;
}
export async function canceledPurchase(itemId: string): Promise<string> {
  return `canceled purchase ${itemId}!`;
}
