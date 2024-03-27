import { FC } from "react";
import "../assets/App.css";
import CarouselComponent from "../components/CarouselWidget";

const Home: FC<{}> = () => {
  return (
    <div className="page">
      <CarouselComponent />
    </div>
  );
};

export default Home;
