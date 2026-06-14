export default function Subscribe() {
  return (
    <div className="subscribe-banner">
      <div className="sub-icon">✉️</div>
      <div className="sub-text">
        <h3>Отримуй новини на пошту</h3>
        <p>Раз на тиждень — найважливіше з життя спільноти. Без спаму, лише корисне.</p>
      </div>
      <div className="sub-form">
        <input type="email" placeholder="твій@email.com" />
        <button>Підписатись</button>
      </div>
    </div>
  );
}
