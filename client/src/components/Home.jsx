
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
      <div className="container-fluid p-0">

        <div className="row g-2">

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="MacBook Air"
              description="Now supercharged by M5."
              image={MacBookAir}
            />
          </div>

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="iPad Air"
              description="Now supercharged by M4."
              image={iPadAir}
            />
          </div>

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="MacBook Pro"
              description="Now with M5, M5 Pro, and M5 Max."
              image={MacBookPro}
              dark={true}
            />
          </div>

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="iPad Pro"
              description="Advanced AI performance and game-changing capabilities."
              image={iPadPro}
              dark={true}
            />
          </div>

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="Trade In"
              description="Get credit toward your next iPhone when you trade in an eligible device."
              image={TradeIn}
              // dark={true}
            />
          </div>

          <div className="col-12 col-md-6 p-0">
            <ProductSection
              title="Card"
              description="Get up to 3% Daily Cash back with every purchase."
              image={Card}
              // dark={true}
            />
          </div>

        </div>

      </div>
    </>
  );
}

export default Home;