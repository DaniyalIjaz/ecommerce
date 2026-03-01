import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-white opacity-90 text-sm tracking-wide">
        {text1} <span className="text-stone-900 font-semibold">{text2}</span>
      </p>
      <span className="w-8 sm:w-12 h-px bg-white opacity-90" />
    </div>
  );
};

export default Title;
