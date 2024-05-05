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
      <Fade in={!loading} className="main-element">
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

      <svg
        style={{ zIndex: 1 }}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="svg"
      >
        <path d="M0,128L34.3,117.3C68.6,107,137,85,206,112C274.3,139,343,213,411,224C480,235,549,181,617,160C685.7,139,754,149,823,133.3C891.4,117,960,75,1029,85.3C1097.1,96,1166,160,1234,165.3C1302.9,171,1371,117,1406,90.7L1440,64L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
      </svg>
    </div>
  );
};

export default Home;
