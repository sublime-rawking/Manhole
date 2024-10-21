
import { appName } from "@/assets/constants";
import "./globals.css";


export const metadata = {
  title: appName,
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html >
  );
}
