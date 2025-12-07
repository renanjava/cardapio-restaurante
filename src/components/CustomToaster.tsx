import { Toaster } from "react-hot-toast";

export function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "#1f2937",
          color: "#fff",
          padding: "16px",
          fontWeight: "500",
        },
        success: {
          icon: "✅",
          style: {
            background: "#16a34a",
            color: "#fff",
          },
        },
        error: {
          icon: "❌",
          style: {
            background: "#dc2626",
            color: "#fff",
          },
        },
        custom: {
          icon: "⚠️",
          style: {
            background: "#ffd900",
            color: "#fff",
          },
        },
      }}
    />
  );
}
