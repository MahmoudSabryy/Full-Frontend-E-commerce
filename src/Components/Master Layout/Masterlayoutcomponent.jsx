import { Outlet } from "react-router-dom";
import Footercomponent from "../Footer/Footercomponent";
import Navbarcomponent from "../Navbar/Navbarcomponent";
import Categorybarcomponent from "../Category bar/Categorybarcomponent";

export default function Masterlayoutcomponent({ userData, logOut }) {
  return (
    <>
      <header className="sticky top-0 z-50">
        <Navbarcomponent userData={userData} logOut={logOut} />
        <Categorybarcomponent />
      </header>

      <main>
        <Outlet />
      </main>
      <Footercomponent />
    </>
  );
}
