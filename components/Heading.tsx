import React from "react";

interface Props {
  title: string;
  description: string;
}

const Heading = ({ title, description }: Props) => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>

      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Heading;
