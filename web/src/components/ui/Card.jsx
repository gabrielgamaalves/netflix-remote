export function Card({ imageUrl, alt = "Continuar assistindo" }) {
  return (
    <div className="flex-center mt-10">
      <img
        className="w-80 rounded-xl"
        src={imageUrl}
        alt={alt}
      />
    </div>
  );
}
