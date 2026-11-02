import { ImageResponse } from "next/og";

export const alt = "Dana Pani Restaurant, Peoples Colony, Multan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamic = "force-static";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(180deg,#171714 0%,#123C32 100%)",
          color: "#F5F0E6",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: "#C6A56B" }}>PEOPLES COLONY · MULTAN</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 180, lineHeight: 0.9 }}>DANA PANI</div>
          <div style={{ fontSize: 44, fontStyle: "italic", color: "#DCC493", marginTop: 24 }}>Where Every Meal Becomes a Memory.</div>
        </div>
        <div style={{ display: "flex", height: 2, background: "#C6A56B", opacity: 0.6 }} />
      </div>
    ),
    size,
  );
}
