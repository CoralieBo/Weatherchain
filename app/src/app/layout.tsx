"use client";

import React, { useEffect, useState } from "react";
import { Web3Provider } from "../components/connect/web3provider";
import { ConnectKitButton } from "connectkit";
import localFont from "next/font/local";

import "./globals.css";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

type WeatherType = "rain" | "sun" | "cloudy";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [currentWeather, setCurrentWeather] = useState<WeatherType>("sun");
  const [autoChange, setAutoChange] = useState(true); // Para controlar cambios automáticos

  useEffect(() => {
    if (!autoChange) return; // No ejecuta el intervalo si autoChange es false

    const weatherOptions: WeatherType[] = ["rain", "sun", "cloudy"];
    const interval = setInterval(() => {
      const randomWeather =
        weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      setCurrentWeather(randomWeather);
    }, 2000);

    return () => clearInterval(interval);
  }, [autoChange]);

  const handleWeatherChange = (weather: WeatherType) => {
    setAutoChange(false); // Desactiva cambios automáticos
    setCurrentWeather(weather);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Web3Provider>
          <Link href="/" className="text-4xl font-bold text-center absolute top-5 left-1/2 transform -translate-x-1/2">
            Weatherchain
          </Link>
          <div className="absolute top-5 right-5 flex items-center gap-3">
            <Link href="/history" className="text-lg font-semibold">
              History
            </Link>
            <ConnectKitButton />
          </div>
          <div className="h-[calc(100vh-5rem)] mt-20">
            {children}
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
