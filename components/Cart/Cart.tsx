import CartItems from "./CartItems";
import CartSummary from "./CartSummary";

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <CartItems />
        <CartSummary />
      </div>
    </div>
  );
}
