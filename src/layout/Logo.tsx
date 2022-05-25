import * as React from "react";
import { SVGProps } from "react";
import { useTheme } from "@mui/material/styles";

const Logo = (props: SVGProps<SVGSVGElement>) => {
  const theme = useTheme();
  return (
    <svg
      width="842.333"
      height="90"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-171.166 5.585 842.333 138.83"
      // style="background:#fff"
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      <defs>
        <filter
          id="editing-hover"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feFlood floodColor="#bbcedd" result="flood" />
          <feComposite
            operator="in"
            in2="SourceAlpha"
            in="flood"
            result="shadow"
          />
          <feOffset dx="2.8" dy="-4" in="SourceGraphic" result="offset-1" />
          <feOffset dx="-2.8" dy="4" in="shadow" result="offset-2" />
          <feMerge>
            <feMergeNode in="offset-2" />
            <feMergeNode in="offset-1" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#editing-hover)">
        <path
          d="M-27.24 101.695q-10.05 0-15.52-4.42-5.48-4.42-5.48-14.34v-21.44h-3.2v-10.49h23.68v10.49h-2.56v24.71q0 2.11.93 3.1.93.99 2.79.99 1.85 0 2.78-.99.93-.99.93-3.1v-24.71h-2.56v-10.49H-3.5v10.49h-3.2v21.44q0 9.92-5.31 14.34t-15.23 4.42Zm65.6-11.4h2.81v10.5H20.95v-10.5h2.69v-10.49q0-2.11-.9-3.11-.9-.99-2.69-.99-3.84 0-3.84 4.1v10.49h2.69v10.5H-1.32v-10.5h2.81v-14.59h-2.81v-10.49h17.53v4.99q4.61-5.89 11.52-5.89 5.31 0 7.97 3.33t2.66 9.15v13.5Zm17.47 11.4q-6.53 0-9.83-4.87-3.29-4.86-3.29-13.82T46 69.175q3.3-4.86 9.83-4.86 3.26 0 5.79 1.6 2.53 1.6 4.13 3.65v-8.07h-3.78v-10.49h18.5v39.29h2.81v10.5H65.75v-4.35q-1.6 2.05-4.13 3.65t-5.79 1.6Zm6.21-11.4q1.85 0 2.78-.99.93-.99.93-3.1v-6.4q0-2.11-.93-3.11-.93-.99-2.78-.99-1.86 0-2.79.99-.93 1-.93 3.11v6.4q0 2.11.93 3.1.93.99 2.79.99Zm42.36 11.4q-9.08 0-14.2-4.77-5.12-4.77-5.12-13.92t5.12-13.92q5.12-4.77 14.2-4.77 9.03 0 13.03 4.7 4 4.71 4 11.68v4.61h-20.74v.39q0 2.36 1.41 3.48t4.67 1.12q3.91 0 7.43-.57 3.52-.58 6.14-1.47v10.24q-2.24 1.21-6.56 2.2-4.32 1-9.38 1Zm-3.71-23.43h7.43v-.77q0-2.17-.93-3.13t-2.79-.96q-1.85 0-2.78.99-.93.99-.93 3.1v.77Zm22.66 22.53v-10.5h2.81v-14.59h-2.81v-10.49h2.94q0-7.81 3.81-11.46 3.81-3.65 11.1-3.65 3.52 0 6.31.51 2.78.52 4.06 1.16v10.04q-3.39-.32-6.27-.32-2.5 0-3.46.84-.96.83-.96 2.88h5v10.49h-5v14.59h5v10.5h-22.53Zm40.7-39.1H151v-10.69h13.05v10.69Zm4.23 39.1h-20.36v-10.5h2.82v-14.59h-2.82v-10.49h17.54v25.08h2.82v10.5Zm41.47-10.5h2.81v10.5h-20.22v-10.5h2.69v-10.49q0-2.11-.9-3.11-.89-.99-2.69-.99-3.84 0-3.84 4.1v10.49h2.69v10.5h-20.22v-10.5h2.81v-14.59h-2.81v-10.49h17.53v4.99q4.61-5.89 11.52-5.89 5.32 0 7.97 3.33 2.66 3.33 2.66 9.15v13.5Zm23.93 11.4q-9.08 0-14.2-4.77-5.12-4.77-5.12-13.92t5.12-13.92q5.12-4.77 14.2-4.77 9.03 0 13.03 4.7 4 4.71 4 11.68v4.61h-20.74v.39q0 2.36 1.41 3.48t4.67 1.12q3.91 0 7.43-.57 3.52-.58 6.14-1.47v10.24q-2.24 1.21-6.56 2.2-4.32 1-9.38 1Zm-3.71-23.43h7.43v-.77q0-2.17-.93-3.13t-2.79-.96q-1.85 0-2.78.99-.93.99-.93 3.1v.77Zm35.27 23.43q-6.53 0-9.83-4.87-3.29-4.86-3.29-13.82t3.29-13.83q3.3-4.86 9.83-4.86 3.26 0 5.79 1.6 2.53 1.6 4.13 3.65v-8.07h-3.78v-10.49h18.5v39.29h2.81v10.5h-17.53v-4.35q-1.6 2.05-4.13 3.65t-5.79 1.6Zm6.2-11.4q1.86 0 2.79-.99.93-.99.93-3.1v-6.4q0-2.11-.93-3.11-.93-.99-2.79-.99-1.85 0-2.78.99-.93 1-.93 3.11v6.4q0 2.11.93 3.1.93.99 2.78.99Zm62.47 11.4q-6.15 0-11.62-1.06-5.47-1.06-8.41-2.4v-12.67h14.08q0 1.98.89 2.88.9.89 3.27.89 1.98 0 2.84-.6.87-.61.87-1.83 0-1.02-.83-1.76-.84-.73-2.88-1.5l-5.51-1.92q-7.1-2.69-10.21-6.34-3.1-3.65-3.1-9.85 0-7.56 4.96-11.49 4.96-3.94 16.54-3.94 5.57 0 10.47 1.12 4.89 1.12 7.9 2.98v11.45h-12.8q0-3.2-3.97-3.2-1.92 0-2.72.48-.8.48-.8 1.7 0 1.09.93 1.73.93.64 3.04 1.34l5.57 1.92q6.78 2.31 9.89 5.99 3.1 3.68 3.1 9.63 0 8.13-5.47 12.29-5.47 4.16-16.03 4.16Zm38.97 0q-6.78 0-10.2-3.3-3.43-3.3-3.43-11.1v-11.59h-2.81v-10.49q2.43 0 3.64-1.25 1.22-1.25 1.22-3.43v-2.88h13.57v7.56h8.64v10.49h-8.64v10.5q0 2.11.93 3.1.92.99 2.78.99 2.43 0 5.31-.57v10.05q-1.79.7-4.83 1.31-3.04.61-6.18.61Zm32.13 0q-9.09 0-14.21-4.77-5.12-4.77-5.12-13.92t5.12-13.92q5.12-4.77 14.21-4.77 9.22 0 14.27 4.83 5.06 4.83 5.06 13.86 0 9.15-5.12 13.92t-14.21 4.77Zm0-11.4q1.86 0 2.79-.99.92-.99.92-3.1v-6.4q0-2.11-.92-3.11-.93-.99-2.79-.99-1.85 0-2.78.99-.93 1-.93 3.11v6.4q0 2.11.93 3.1.93.99 2.78.99Zm48.71-25.98q1.28 0 2.43.26 1.15.25 1.92.64v12.22q-2.63-1.09-5.63-1.09-4.04 0-6.21 2.11-2.18 2.12-2.18 6.28v5.56h5.76v10.5h-23.29v-10.5h2.81v-14.59h-2.81v-10.49h17.53v4.67q1.79-2.69 4.1-4.13 2.3-1.44 5.57-1.44Zm22.52-2.62h-13.05v-10.69h13.05v10.69Zm4.23 39.1h-20.35v-10.5h2.81v-14.59h-2.81v-10.49h17.53v25.08h2.82v10.5Zm20.86.9q-9.09 0-14.21-4.77-5.12-4.77-5.12-13.92t5.12-13.92q5.12-4.77 14.21-4.77 9.03 0 13.03 4.7 4 4.71 4 11.68v4.61h-20.74v.39q0 2.36 1.41 3.48t4.67 1.12q3.9 0 7.42-.57 3.52-.58 6.15-1.47v10.24q-2.24 1.21-6.56 2.2-4.32 1-9.38 1Zm-3.71-23.43h7.42v-.77q0-2.17-.92-3.13-.93-.96-2.79-.96-1.85 0-2.78.99-.93.99-.93 3.1v.77Zm38.21 23.43q-8.07 0-15.55-2.56v-9.48h10.36v.64q0 3.08 3.91 3.08 3.45 0 3.45-2.37 0-1.28-.99-1.92-.99-.64-3.49-1.09l-3.2-.58q-10.04-1.79-10.04-11.39 0-5.57 4.22-8.64 4.22-3.07 11.39-3.07 8 0 13.51 2.69v8.89h-9.73v-.64q0-1.28-.87-1.95-.86-.67-2.52-.67-3.2 0-3.2 2.05 0 1.09.89 1.66.9.58 3.27 1.09l3.64.7q5.7 1.09 8.13 4.04 2.43 2.94 2.43 7.55 0 5.82-4.06 8.89-4.06 3.08-11.55 3.08Z"
          fill="#85a2b6"
        />
      </g>
      <style></style>
    </svg>
    /*
    <svg width={234.532} height={20.475} viewBox="0 0 62.053 5.417" {...props}>
      <g
        aria-label="~Undefined Stories~"
        style={{
          lineHeight: 1.25,
        }}
        fontWeight={4}
        fontSize={7.056}
        fontFamily="Permanent Marker"
        letterSpacing={0}
        wordSpacing={0}
        strokeWidth={0.265}
        fill={theme.palette.secondary.light}
      >
      </g>
    </svg>
 */
  );
};

export default Logo;
