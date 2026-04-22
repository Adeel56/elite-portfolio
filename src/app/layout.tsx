import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NeuralFluidCanvas } from "@/components/canvas/NeuralFluid";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elite Portfolio | AI & Full-Stack Engineer",
  description: "Senior Full-Stack & AI Engineer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent selection:text-black cursor-none">
        <Providers>
          <NeuralFluidCanvas />
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
