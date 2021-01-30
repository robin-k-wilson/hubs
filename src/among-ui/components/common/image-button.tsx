import React from "react";
import PropTypes from "prop-types";

export type ImageButtonProps = {
  imageSrc: string;
  alt: string;
  wrapperClasses: string;
  imageClasses: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

// <ImageButton imageSrc={} alt="" wrapperClasses="" imageClasses="", onClick={} />
export function ImageButton(props: ImageButtonProps) {
  const { imageSrc, alt, wrapperClasses, imageClasses, onClick } = props;
  return (
    <div className={wrapperClasses}>
      <img alt={alt} className={imageClasses} onClick={onClick} src={imageSrc} />
    </div>
  );
}

ImageButton.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  wrapperClasses: PropTypes.string,
  imageClasses: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
