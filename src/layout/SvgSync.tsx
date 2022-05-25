export interface SvgSyncProps {
  size?: string; // size of square container
  style?: React.CSSProperties; // not for height or width
}

export const SvgSync: React.FC<SvgSyncProps> = ({ size = "24px", style }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
        height: size,
        width: size,
      }}
    >
      <div
        style={{
          position: "relative",
          height: 0,
          width: "100%",
          padding: 0,
          paddingBottom: "100%",
        }}
      >
        <svg
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            left: 0,
            top: 0,
          }}
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M434.67 285.59v-29.8c0-98.73-80.24-178.79-179.2-178.79a179 179 0 00-140.14 67.36m-38.53 82v29.8C76.8 355 157 435 256 435a180.45 180.45 0 00140-66.92"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="M32 256l44-44 46 44m358 0l-44 44-46-44"
          />
        </svg>
      </div>
    </div>
  );
};
