import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArticleList from "@/components/ArticleList";
import Sidebar from "@/components/Sidebar";
import Subscribe from "@/components/Subscribe";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="portal">
      <Header />
      <Hero />
      <div className="main">
        <ArticleList />
        <Sidebar />
      </div>
      <Subscribe />
      <Footer />
    </div>
  );
}
