/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as wf from "@temporalio/workflow";
// // Only import the activity types
import type * as activities from "./activities";

const { checkoutItem, canceledPurchase, purchase } = wf.proxyActivities<
  typeof activities
>({
  startToCloseTimeout: "1 minute",
});

type PurchaseState =
  | "PURCHASE_PENDING"
  | "PURCHASE_CONFIRMED"
  | "PURCHASE_CANCELED";

export const cancelPurchase = wf.defineSignal<[number]>("cancelPurchase");
export const purchaseStateQuery =
  wf.defineQuery<PurchaseState>("purchaseState");

export async function OneClickBuy(itemId: string) {
  const itemToBuy = itemId;
  let purchaseState: PurchaseState = "PURCHASE_PENDING";
  wf.setHandler(cancelPurchase, (num) => {
    console.log("passed", num);
    purchaseState = "PURCHASE_CANCELED";
  });
  wf.setHandler(purchaseStateQuery, () => purchaseState);
  if (await wf.condition(() => purchaseState === "PURCHASE_CANCELED", "5s")) {
    return await canceledPurchase(itemToBuy);
  } else {
    purchaseState = "PURCHASE_CONFIRMED";
    return await checkoutItem(itemToBuy);
  }
  // const result = await purchase(itemId); // calling the activity
  // await wf.sleep("10 seconds"); // demo use of timer
  // console.log(`Activity ID: ${result} executed!`);
}
