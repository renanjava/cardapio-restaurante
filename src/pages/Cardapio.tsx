import { Header } from "@/components/Header";
import { MarmitaOrderForm } from "@/components/MarmitaOrderForm";
import { useSearchParams } from "react-router-dom";
import { marmitaSizes } from "@/data/menuData";
import { useDay } from "@/contexts/DayContext";
import { ServiceClosed } from "@/components/ServiceClosed";

const Cardapio = () => {
  const [searchParams] = useSearchParams();
  const sizeId = searchParams.get("size");
  const size = marmitaSizes.find((s) => s.id === sizeId);
  const { isOpen } = useDay();

  if (!isOpen) {
    return <ServiceClosed />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showBack title={size?.name || "Cardápio"} />

      <main className="flex-1 flex flex-col">
        <MarmitaOrderForm />
      </main>
    </div>
  );
};

export default Cardapio;
