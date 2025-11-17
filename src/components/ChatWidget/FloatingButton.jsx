import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function FloatingButton({ onClick, show }) {
  const size = 60;
  const margin = 24;
  const buttonRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Khởi tạo vị trí ban đầu ở góc dưới phải
  useEffect(() => {
    const updatePosition = () => {
      setPosition({
        x: window.innerWidth - size - margin,
        y: window.innerHeight - size - margin,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  // Xử lý khi kéo kết thúc
  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    
    const newX = position.x + info.offset.x;
    const newY = position.y + info.offset.y;

    // Giới hạn trong viewport
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  // Ngăn onClick khi đang kéo
  const handleClick = (e) => {
    if (!isDragging && onClick) {
      onClick(e);
    }
  };

  if (!show || !position) return null;

  return (
    <motion.button
      ref={buttonRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: 0,
        right: window.innerWidth - size,
        top: 0,
        bottom: window.innerHeight - size,
      }}
      initial={{ x: position.x, y: position.y }}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(to right, #f472b6, #fb7185)",
        color: "white",
        border: "none",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      animate={{ 
        x: position.x, 
        y: position.y,
        scale: isDragging ? 1.1 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      whileHover={{ scale: isDragging ? 1.1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={28} />
    </motion.button>
  );
}