import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { MarmitaOrderForm } from "@/components/MarmitaOrderForm";
import { useSearchParams } from "react-router-dom";
import { marmitaSizes, dayNames, dayDisplayNames } from "@/data/menuData";

const Cardapio = () => {
  const [searchParams] = useSearchParams();
  const sizeId = searchParams.get("size");
  const size = marmitaSizes.find((s) => s.id === sizeId);

  const today = 2;
  const dayKey = dayNames[today];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showBack title={size?.name || "Cardápio"} />

      <main className="flex-1 flex flex-col">
        <MarmitaOrderForm />
      </main>

      <BottomNav />
    </div>
  );
};

export default Cardapio;
