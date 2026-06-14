export default function Sidebar() {
  return (
    <aside>
      <div className="sidebar">

        <div className="sidebar-box">
          <p className="section-label">Найближчі події</p>

          <div className="event-item">
            <div className="event-date">
              <div className="event-day">14</div>
              <div className="event-mon">чер</div>
            </div>
            <div>
              <p className="event-title">Зустріч спільноти в кафе</p>
              <p className="event-loc">📍 Altstadt, СГ</p>
            </div>
          </div>

          <div className="event-item">
            <div className="event-date">
              <div className="event-day">21</div>
              <div className="event-mon">чер</div>
            </div>
            <div>
              <p className="event-title">Майстер-клас — вишиванка</p>
              <p className="event-loc">📍 Культурний центр</p>
            </div>
          </div>

          <div className="event-item">
            <div className="event-date">
              <div className="event-day">5</div>
              <div className="event-mon">лип</div>
            </div>
            <div>
              <p className="event-title">Спільний перегляд фільму</p>
              <p className="event-loc">📍 Онлайн</p>
            </div>
          </div>

        </div>

      </div>
    </aside>
  );
}
