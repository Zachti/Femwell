import { FC } from "react";
import "../assets/App.css";
import CarouselComponent from "../components/CarouselWidget";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDna } from "@fortawesome/free-solid-svg-icons";

const Home: FC<{}> = () => {
  return (
    <div className="page">
      <Header image="/purpleSea.jpg">
        <h1>
          Things to know
          <FontAwesomeIcon
            icon={faDna}
            style={{
              marginLeft: "10px",
              filter: "drop-shadow(4px 10px 10px rgba(0, 0, 0, 0.7))",
            }}
          />
        </h1>
        ,
      </Header>
      <CarouselComponent />
    </div>
  );
};

export default Home;
