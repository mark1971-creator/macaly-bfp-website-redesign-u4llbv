import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0E1B3E", padding: "2rem" }}>
      <style>{`
        .not-found-link {
          display: inline-block;
          padding: 12px 32px;
          border: 1px solid #C49A47;
          color: #C49A47;
          text-decoration: none;
          border-radius: 24px;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .not-found-link:hover {
          background: rgba(196, 154, 71, 0.1);
        }
      `}</style>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <h1 style={{ fontSize: "120px", margin: "0", color: "#C49A47", fontWeight: 300, fontFamily: "Georgia, serif" }}>404</h1>
        <h2 style={{ fontSize: "36px", color: "#FFFFFF", marginTop: "1rem", fontFamily: "Georgia, serif", fontWeight: 300 }}>Page Not Found</h2>
        <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.7)", marginTop: "1rem", lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or may have moved. Let's get you back on track.
        </p>
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="not-found-link">
            Go Home
          </Link>
          <Link href="/insight" className="not-found-link">
            Read Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
