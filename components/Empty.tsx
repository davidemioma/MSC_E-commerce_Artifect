import React from "react";

type Props = {
  message: string;
};

const Empty = ({ message }: Props) => {
  return (
    <div className="w-full h-[calc(100vh-250px)] flex items-center justify-center">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="flex items-center gap-2">
          <div className="text-7xl">🛍</div>

          <div className="text-4xl font-medium">LocalMart</div>
        </div>

        <p className="text-gray-500 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Empty;
