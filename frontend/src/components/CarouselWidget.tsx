import { useState, useEffect, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Carousel from "react-multi-carousel";
import CarouselItem from "./CarouselItem";
import "react-multi-carousel/lib/styles.css";
import "../assets/Carousel.css";
import { faDna } from "@fortawesome/free-solid-svg-icons";

interface CarouselProps {
  label?: string;
}

const CarouselComponent: FC<CarouselProps> = ({ label }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1200 },
      items: 5,
    },
    LargeDesktop: {
      breakpoint: { max: 1200, min: 1024 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1000, min: 700 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 700, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const carouselItems = [
    {
      label: "Here for you 1",
      content: "In eget dui ut mi ultrices convallis non at mi.",
    },
    {
      label: "Here for you 2",
      content: "Ut sagittis sapien et libero suscipit placerat.",
    },
    {
      label: "Here for you 3",
      content:
        "In felis odio, euismod vel vulputate in, malesuada luctus purus.",
    },
    {
      label: "Here for you 4",
      content:
        "Praesent pretium nibh eget lacus sagittis, id faucibus leo elementum.",
    },
    {
      label: "Here for you 5",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  return (
    <div className="carousel-wrapper">
      <h2>
        <span>Things to</span>
        <span style={{ color: "var(--text-color-a)" }}> know</span>
        <FontAwesomeIcon
          icon={faDna}
          style={{ marginLeft: "10px", color: "var(--text-color-a)" }}
        />
      </h2>
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={windowWidth < 500 ? true : false}
        autoPlaySpeed={2500}
        containerClass="carousel-container"
      >
        {carouselItems.map((item, index) => (
          <CarouselItem key={index} label={item.label} content={item.content} />
        ))}
      </Carousel>
    </div>
  );
};
export default CarouselComponent;
