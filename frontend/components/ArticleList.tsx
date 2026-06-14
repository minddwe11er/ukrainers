export default function ArticleList() {
  return (
    <section>
      <p className="section-label">Останні новини</p>
      <div className="articles">

        <a href="#" className="article-card">
          <div className="article-thumb">🏛</div>
          <div className="article-body">
            <p className="article-title">Зустріч з представниками кантонального офісу інтеграції</p>
            <p className="article-meta">
              <span className="badge badge-sm">Офіційне</span>
              28 травня · 3 хв читання
            </p>
          </div>
        </a>

        <a href="#" className="article-card">
          <div className="article-thumb">🎵</div>
          <div className="article-body">
            <p className="article-title">Музичний вечір у неділю — запрошуємо всіх</p>
            <p className="article-meta">
              <span className="badge badge-sm badge-warn">Подія</span>
              25 травня · 2 хв читання
            </p>
          </div>
        </a>

        <a href="#" className="article-card">
          <div className="article-thumb">📚</div>
          <div className="article-body">
            <p className="article-title">Мовні курси для дорослих: нова група у вересні</p>
            <p className="article-meta">
              <span className="badge badge-sm">Навчання</span>
              20 травня · 4 хв читання
            </p>
          </div>
        </a>

        <a href="#" className="article-card">
          <div className="article-thumb">❤️</div>
          <div className="article-body">
            <p className="article-title">Волонтерська акція: допомагаємо збирати одяг для переселенців</p>
            <p className="article-meta">
              <span className="badge badge-sm badge-warn">Волонтерство</span>
              15 травня · 2 хв читання
            </p>
          </div>
        </a>

      </div>
    </section>
  );
}
