import { useState ,useEffect} from "react";
import "./Entertainment.css";

function Entertainment() {
  const cards = [
    {
      title: "Last Seen",
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/QMAplm1QCKqziJl9O7SeRA/2400x1350sr.webp",
      link:
        "https://tv.apple.com/us/show/last-seen/umc.cmc.4pbw9c936a4pigdvsg23u2bsa?itsct=atv-apl_hp-stream_now--220622",
    },

    {
      title: "Severance",
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/Features/v4/a4/62/55/a462556e-768f-b4fe-8b39-9a8a34a4da43/828bd9de-f910-431a-b6b0-e5e3f9bc436c.png/2400x1350sr.webp",
      link:
        "https://tv.apple.com/us/channel/mls/tvs.sbd.7000",
    },

    {
      title: "Silo",
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/Features/v4/de/75/a2/de75a275-83d6-1136-564d-7d066dfa7b73/d2147992-76f0-4347-9cfa-557060d510d2.png/2400x1350sr.webp",
      link:
        "https://tv.apple.com/us/room/uts.room.formula-1",
    },

    {
      title: "Slow Horses",
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/jRjHtSu5zuW3c4PsVNUtJg/2400x1350sr.webp",
      link:
        "https://tv.apple.com/us/show/widows-bay/umc.cmc.1zzly0vah46bnvnwf0qkrjhh2",
    },

    {
      title: "Ted Lasso",
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/t4WfFAvdWg608nQz0Mt_OQ/2400x1350sr.webp",
      link:
        "https://tv.apple.com/us/show/ted-lasso/umc.cmc.vtoh0mn0xn7t3c643xqonfzy",
    },

    {
      title: "circuites in focus",
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/Features/v4/de/75/a2/de75a275-83d6-1136-564d-7d066dfa7b73/d2147992-76f0-4347-9cfa-557060d510d2.png/2400x1350sr.webp",
      link:
        "https://tv.apple.com/us/room/uts.room.formula-1",
    },
  ];

   const [activeIndex, setActiveIndex] = useState(0);

  // Automatically move every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        return (current + 1) % cards.length;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [cards.length]);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % cards.length);
  };

  const previousSlide = () => {
    setActiveIndex(
      (current) => (current - 1 + cards.length) % cards.length
    );
  };

  return (
    <section className="entertainment">

      <h2 className="entertainment-title">
        Endless entertainment.
      </h2>

      <div className="entertainment-carousel">

        <div
          className="entertainment-track"
          style={{
            transform: `translateX(calc(50% - ${
              activeIndex * 70
            }vw - ${activeIndex * 24}px - 35vw))`,
          }}
        >
          {cards.map((card, index) => (
            <div
              className={`entertainment-card ${
                index === activeIndex ? "active" : ""
              }`}
              key={index}
            >
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={card.image}
                  alt={card.title}
                />
              </a>
            </div>
          ))}
        </div>

        <button
          className="carousel-button carousel-prev"
          onClick={previousSlide}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <button
          className="carousel-button carousel-next"
          onClick={nextSlide}
        >
          <i className="bi bi-chevron-right"></i>
        </button>

      </div>

      <div className="carousel-dots">
        {cards.map((_, index) => (
          <button
            key={index}
            className={
              index === activeIndex ? "active-dot" : ""
            }
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

    </section>
  );
}

export default Entertainment;