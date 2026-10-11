import React from "react";
import Marquee from "react-fast-marquee";

const brands = [
  "https://i.ibb.co/XfdQHZTw/amazon.png",
  "https://i.ibb.co/7Hg5fH8/casio.png",
  "https://i.ibb.co/5XFV9dVW/moonstar.png",
  "https://i.ibb.co/cSxzmZD6/randstad.png",
  "https://i.ibb.co/VYsjKNJh/star.png",
  "https://i.ibb.co/6R0WjPLM/start-people.png",
];

const Brands = () => {
  return (
    <section className="w-full py-15 overflow-hidden">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary text-center mb-20">
        We've helped thousands of sales teams
      </h2>

      {/* Marquee */}
      <Marquee gradient={false} speed={50}>
        {brands.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="brand"
            className="w-28 md:w-40 lg:w-48 object-contain opacity-90 hover:opacity-100 transition mx-8"
          />
        ))}
      </Marquee>
    </section>
  );
};

export default Brands;
