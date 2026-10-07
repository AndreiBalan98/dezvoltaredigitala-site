import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = { title: "Calculator punctaj baterii" };

export default function CalculatorBaterii() {
  return (
    <>
      <PageHead title="Calculator punctaj baterii" />
      <section className="section">
        <div className="container">
          <Calculator />
        </div>
      </section>
    </>
  );
}
