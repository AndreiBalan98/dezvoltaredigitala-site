import Image from "next/image";
import Card from "./Card";
import Section from "./Section";

// "Servicii diversificate": the same six cards at the end of every service page (spec 004).
const ITEMS = [
  { icon: "/media/2025/02/web.svg", title: "WEBSITE", text: "Dezvoltare website-uri, e-commerce și software specializat" },
  {
    icon: "/media/2025/02/analiza-teh-1.svg",
    title: "ANALIZĂ TEHNICĂ",
    text: "Servicii de analiză pentru identificarea soluțiilor tehnice necesare digitalizării afacerii",
  },
  { icon: "/media/2025/02/optimation-seo-speed-svgrepo-com.svg", title: "CRM", text: "CRM (Customer Relationship Management)" },
  {
    icon: "/media/2025/02/analytics-chart-earning-svgrepo-com.svg",
    title: "GESTIUNE",
    text: "Soluții pentru gestiune financiară, gestiunea furnizorilor, resurse umane, logistică",
  },
  {
    icon: "/media/2025/02/search-seo-word-svgrepo-com.svg",
    title: "IOT",
    text: "Implementare tehnologii de tip IoT (Internet of Things), AI (Artificial Intelligence)",
  },
  {
    icon: "/media/2025/02/data-protection-save-svgrepo-com.svg",
    title: "CLOUD",
    text: "Servicii de tip Cloud Computing și securitate cibernetică",
  },
];

export default function ServiceGrid() {
  return (
    <Section light center title="Servicii diversificate">
      <div className="grid-3">
        {ITEMS.map((item) => (
          <Card key={item.title} className="service service--large">
            <Image src={item.icon} alt="" width={96} height={96} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
