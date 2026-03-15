export default function Avatar({
  src,
  name = "User",
  size = "md",
  online = false,
}) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12",
    xl: "w-16 h-16 text-lg",
  };

  const statusSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
  };

  const firstLetter = name?.charAt(0).toUpperCase();

  return (
    <div className={`relative inline-flex ${sizes[size]} rounded-full items-center justify-center bg-yellow-500 text-white font-semibold`}>
      
      <div>
        {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span>{firstLetter}</span>
      )}
      </div>

      {
        online && <span className={`${statusSizes[size]} bg-green-500 absolute bottom-0 right-0 rounded-full ring-2 ring-white`}></span>
      }
      
    </div>
  );
}