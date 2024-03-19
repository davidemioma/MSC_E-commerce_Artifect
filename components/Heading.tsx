import React from "react";

interface Props {
  title: string;
  description: string;
}

const Heading = ({ title, description }: Props) => {
  return (
    <div>
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight"
        aria-label={title}
      >
        {title}
      </h2>

      <p className="text-sm text-black font-light">{description}</p>
    </div>
  );
};

export default Heading;
