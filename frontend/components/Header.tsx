export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">📍</span>
        Наша спільнота
      </div>
      <div className="header-right">
        <nav className="nav">
          <a href="#" className="nav-link active">Новини</a>
          <a href="#" className="nav-link">Події</a>
          <a href="#" className="nav-link">Статті</a>
          <a href="#" className="nav-link">Про нас</a>
        </nav>
        <div className="lang-switcher">
          <button className="lang-btn active">🇺🇦 UA</button>
          <button className="lang-btn">🇨🇭 DE</button>
        </div>
      </div>
    </header>
  );
}
