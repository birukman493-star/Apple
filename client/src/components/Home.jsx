
import ProductSection from "./ProductSection";

import MacBookAir from "../assets/images (8).jpg";
import iPadAir from "../assets/images (9).jpg";
import MacBookPro from "../assets/images (10).jpg";
import iPadPro from "../assets/images (11).jpg";
import TradeIn from "../assets/TradeIn.jpg";
import Card from "../assets/Card.jpg";

function Home() {
  return (
    <>
  <div className="sr-hero sr-theme--dark">
    <div className="sr-hero__content">
      <h1 className="sr-hero__title">Apple Store</h1>
      <p className="sr-hero__subtitle">Explore the latest Apple products.</p>
      <div className="sr-hero__actions">
        <a href="/store" className="sr-btn sr-btn--primary">Shop Now</a>
      </div>
    </div>
  </div>
      <div className="container-fluid p-0">

        <div className="row g-2">

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="MacBook Air"
              description="Now supercharged by M5."
              image={MacBookAir}
              learnLink="/mac"
              buyLink="/store"
            />
          </div>

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="iPad Air"
              description="Now supercharged by M4."
              image={iPadAir}
              learnLink="/ipad"
              buyLink="/store"
            />
          </div>

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="MacBook Pro"
              description="Now with M5, M5 Pro, and M5 Max."
              image={MacBookPro}
              dark={true}
              learnLink="/mac"
              buyLink="/store"
            />
          </div>

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="iPad Pro"
              description="Advanced AI performance and game-changing capabilities."
              image={iPadPro}
              dark={true}
              learnLink="/ipad"
              buyLink="/store"
            />
          </div>

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="Trade In"
              description="Get credit toward your next iPhone when you trade in an eligible device."
              image={TradeIn}
              learnLink="/store"
              buyLink="/store"
            />
          </div>

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="Card"
              description="Get up to 3% Daily Cash back with every purchase."
              image={Card}
              learnLink="/store"
              buyLink="/store"
            />
          </div>

        </div>

      </div>
    </>
  );
}

export default Home;