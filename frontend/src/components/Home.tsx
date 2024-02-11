import { FC } from "react";
import "../assets/Home.css";
import CarouselComponent from "./CarouselWidget";

const Home: FC<{}> = () => {
  return (
    <div className="home">
      <CarouselComponent />
    </div>
  );
};

export default Home;
