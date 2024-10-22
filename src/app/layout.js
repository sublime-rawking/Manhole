
import { appName } from "@/assets/constants";
import "./globals.css";
import { poppins } from "@/assets/fonts";
import CustomThemeProvider from "@/provider/themeProvider";


export const metadata = {
  title: appName,
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ ...poppins.style }}>
        <CustomThemeProvider>
          {children}
        </CustomThemeProvider>
      </body>
    </html >
  );
}
