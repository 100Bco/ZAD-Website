import Link from "next/link";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <main id="main" className="page">
        <section className="container" style={{ minHeight: "40vh" }}>
          <p className="label">404</p>
          <h1 className="work-intro__title">Trang này không tồn tại.</h1>
          <p style={{ marginTop: 24 }}>
            <Link className="pill pill--blue" href="/">
              Về trang chủ
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
