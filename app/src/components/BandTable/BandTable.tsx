import * as React from "react";
import { BandContext } from "../../components/BandsProvider";
import { Band } from "../../models/Band";

interface GridProps {
  bands: Band[];
}

function BandTable({ bands }: GridProps) {
  return (
    <div>
      {bands.map((band) => (
        <p>{band.band}</p>
      ))}
    </div>
  );
}

export default BandTable;
