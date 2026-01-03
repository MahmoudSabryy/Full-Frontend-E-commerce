import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Components/App/App";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GlobalDataProvider from "./Context/GlobalData";
import GlobalCartDataProvider from "./CartContext/CartContextData";
import GlobalStatsDataProvider from "./StatsContext/StatsContextData";
import GlobalWishlistDataProvider from "./WishListContext/WishListDataContext";
import GlobalBrandDataProvider from "./BrandContext/BrandContextData";
import GlobalCouponDataProvider from "./CouponContext/CouponContextData";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="181958188812-pr4kd396oat8jtjb8or12b7vlefa1r89.apps.googleusercontent.com">
    <GlobalDataProvider>
      <GlobalCartDataProvider>
        <GlobalStatsDataProvider>
          <GlobalWishlistDataProvider>
            <GlobalBrandDataProvider>
              <GlobalCouponDataProvider>
                <App />
              </GlobalCouponDataProvider>
            </GlobalBrandDataProvider>
          </GlobalWishlistDataProvider>
        </GlobalStatsDataProvider>
      </GlobalCartDataProvider>
    </GlobalDataProvider>
  </GoogleOAuthProvider>
);
