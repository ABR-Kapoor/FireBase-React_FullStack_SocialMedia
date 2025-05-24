import React from "react";
import image2 from "../../assets/image2.jpg";
import image3 from "../../assets/image3.jpg";
import image4 from "../../assets/image4.jpg";
import image1 from "../../assets/image1.jpg";

type Props = {};

function Stories({}: Props) {
  return (
    <div className="flex items-center space-x-3">
      <img
        src={image2}
        className="w-20 h-20 rounded-full border-4 border-slate-700 object-cover"
      />
      <img
        src={image3}
        className="w-20 h-20 rounded-full border-4 border-slate-700 object-cover"
      />
      <img
        src={image4}
        className="w-20 h-20 rounded-full border-4 border-slate-700 object-cover"
      />
      <img
        src={image1}
        className="w-20 h-20 rounded-full border-4 border-slate-700 object-cover"
      />
    </div>
  );
}

export default Stories;
