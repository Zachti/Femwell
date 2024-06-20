import { FC } from "react";
import "../assets/CarouselItem.css";

interface CarouselItemProps {
  label: string;
  image?: string;
  content: string;
}

const CarouselItem: FC<CarouselItemProps> = ({ label, image, content }) => {
  return (
    <div className="carousel-item">
      <img
        className="carousel-image"
        src={
          image
            ? image
            : "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2R1Y3RzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
        }
      ></img>
      <div className="carousel-content">
        <div className="content-top">
          <h3>{label}</h3>
          <p>{content}</p>
        </div>
        <button>read more</button>
      </div>
    </div>
  );
};

export default CarouselItem;
