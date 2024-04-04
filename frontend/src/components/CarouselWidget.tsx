import { useState, useEffect, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Carousel from "react-multi-carousel";
import CarouselItem from "./CarouselItem";
import "react-multi-carousel/lib/styles.css";
import "../assets/Carousel.css";
import { faCircleArrowLeft, faDna } from "@fortawesome/free-solid-svg-icons";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons/faCircleArrowRight";

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
    ultraLargeDesktop: {
      breakpoint: { max: 4000, min: 1625 },
      items: 6,
    },
    largeDesktop: {
      breakpoint: { max: 1625, min: 1200 },
      items: 5,
    },
    mediumDesktop: {
      breakpoint: { max: 1200, min: 1024 },
      items: 4,
    },
    smallDesktop: {
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
    {
      label: "Here for you 6",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  const CustomLeftArrow: FC = (props: any) => {
    const { onClick } = props;
    return (
      <button className="left-arrow" onClick={onClick}>
        <FontAwesomeIcon icon={faCircleArrowLeft} />
      </button>
    );
  };

  const CustomRightArrow: FC = (props: any) => {
    const { onClick } = props;
    return (
      <button className="right-arrow" onClick={onClick}>
        <FontAwesomeIcon icon={faCircleArrowRight} />
      </button>
    );
  };

  return (
    <div className="carousel-wrapper">
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={windowWidth < 500 ? true : false}
        autoPlaySpeed={2500}
        containerClass="carousel-container"
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        renderButtonGroupOutside={true}
      >
        {carouselItems.map((item, index) => (
          <CarouselItem key={index} label={item.label} content={item.content} />
        ))}
      </Carousel>
    </div>
  );
};
export default CarouselComponent;
