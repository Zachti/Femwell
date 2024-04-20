import { FC, useEffect, useState } from "react";
import "../assets/App.css";
import CarouselComponent from "../components/CarouselWidget";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDna } from "@fortawesome/free-solid-svg-icons";
import { Fade } from "@chakra-ui/react";

const Home: FC<{}> = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 30);
  }, []);

  return (
    <div className="page">
      <Fade in={!loading}>
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
        </Header>
        <CarouselComponent />
      </Fade>
    </div>
  );
};

export default Home;
