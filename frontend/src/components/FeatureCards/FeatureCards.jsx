import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  backgroundColor = "rgba(255, 255, 255, 0.1)",
  borderColor = "rgba(255, 255, 255, 0.18)",
  glassBlur = "16px",
  captionText = "",
  containerHeight = "320px",
  containerWidth = "100%",
  cardHeight = "320px", 
  cardWidth = "230px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  accentColor = "rgba(0, 201, 81, 0.5)",
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });
  
  const shimmerOpacity = useSpring(0.4, springValues);

  const [lastY, setLastY] = useState(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
    
    // Update shimmer effect
    shimmerOpacity.set(0.1 + (Math.abs(offsetX) / rect.width * 0.6));
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
    shimmerOpacity.set(0.4);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: cardWidth,
          height: cardHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        {/* Glass card background */}
        <motion.div
          className="absolute top-0 left-0 rounded-[15px] will-change-transform [transform:translateZ(0)]"
          style={{
            width: cardWidth,
            height: cardHeight,
            backgroundColor: backgroundColor,
            backdropFilter: `blur(${glassBlur})`,
            border: `1px solid ${borderColor}`,
            overflow: "hidden",
          }}
        />
        
        {/* Shimmer effect - expanded gradient for taller card */}
        <motion.div
          className="absolute top-0 left-0 h-fit w-fit rounded-[15px] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, 
                         transparent 20%, 
                         ${accentColor} 50%, 
                         transparent 80%)`,
            backgroundSize: "200% 200%", // Make gradient bigger to ensure full coverage
            opacity: shimmerOpacity,
            transform: "translateZ(1px)",
          }}
        />
        
        {/* Bottom accent
        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-b-[15px] will-change-transform"
          style={{
            width: cardWidth,
            background: accentColor.replace("0.5", "0.8"),
            transform: "translateZ(1px)",
          }}
        /> */}

        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]"
            style={{
              width: cardWidth,
              height: cardHeight,
            }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}