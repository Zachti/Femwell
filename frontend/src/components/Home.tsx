import { FC } from "react";
import { Link } from "react-router-dom";
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
