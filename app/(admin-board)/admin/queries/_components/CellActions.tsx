import React from "react";
import { Query } from "@prisma/client";

type Props = {
  data: Query;
};

const CellActions = ({ data }: Props) => {
  return <div>CellActions</div>;
};

export default CellActions;
