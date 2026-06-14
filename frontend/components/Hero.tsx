export default function Hero() {
  return (
    <section className="hero-section">
      <p className="section-label">Головна новина місяця</p>
      <div className="hero">
        <div className="hero-img">
          <div className="hero-img-placeholder">
            <span className="placeholder-icon">🖼</span>
            <span className="placeholder-text">Фото обкладинки</span>
          </div>
        </div>
        <div className="hero-content">
          <span className="badge">Важливо</span>
          <h2 className="hero-title">Спільнота відкриває культурний центр у Санкт-Галлені</h2>
          <p className="hero-excerpt">Після кількох місяців підготовки ми раді оголосити відкриття нового простору для зустрічей, майстер-класів і концертів.</p>
          <div className="hero-meta">
            <span>📅 <span>3 червня 2026</span></span>
            <span>✍️ <span>Редакція</span></span>
          </div>
          <a href="#" className="read-btn">Читати далі →</a>
        </div>
      </div>
    </section>
  );
}
