export default function SubscribeSidebar() {
  return (
    <div className="subscribe-box-sidebar">
      <p className="section-label" style={{ border: 'none', padding: 0, marginBottom: '8px' }}>
        Розсилка новин
      </p>
      <p className="sub-sidebar-desc">Нові статті — прямо на пошту. Без спаму.</p>
      <input type="email" placeholder="твій@email.com" className="sub-sidebar-input" />
      <button className="sub-sidebar-btn">Підписатись</button>
    </div>
  );
}
