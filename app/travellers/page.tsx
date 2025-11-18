import TravellersList from "@/components/TravellersList/TravellersList";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function TravellersPage() {
  return (
    <>
      <Header />

        <h1 style={{ textAlign: "center", marginBottom: "32px" }}>Мандрівники</h1>
        <TravellersList />

      <Footer />
    </>
  );
}
