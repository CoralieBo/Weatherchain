"use client";

import React, { useRef } from "react";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import { useGetWeatherHistoryByDate } from "@/hooks/read/useGetWeatherHistoryByDate";
import { images } from "@/interfaces/NFT";
import logo from "./images/logo.jpg";
import Image from "next/image";

const ROTATION_RANGE = 35;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

const PERSPECTIVE = "1500px";

const Home = () => {

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const timestamp = startOfDay.getTime() / 1000;
    
    const { history } = useGetWeatherHistoryByDate(timestamp);

    return (
        <div>
            <div
                style={{
                    backgroundImage: `url("${images[history[history?.length-1]?.condition]}")`,
                }}
                className="relative h-[calc(100vh-5rem)] bg-neutral-100 bg-no-repeat bg-cover bg-center">
                <TiltShineCard />
            </div>
        </div>
    );
};

const TiltShineCard = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const timestamp = startOfDay.getTime() / 1000;
    const { history } = useGetWeatherHistoryByDate(timestamp);

    const ref = useRef<HTMLDivElement | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x);
    const ySpring = useSpring(y);

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const sheenOpacity = useTransform(
        ySpring,
        [-HALF_ROTATION_RANGE, 0, HALF_ROTATION_RANGE],
        [0.5, 0, 0.5]
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

        const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
        const rY = mouseX / width - HALF_ROTATION_RANGE;

        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div
            style={{
                perspective: PERSPECTIVE,
            }}
            className="absolute inset-0 grid place-content-center overflow-visible"
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform,
                    backgroundSize: "cover",
                }}
                className="relative aspect-[10/13] w-96 overflow-hidden rounded-lg bg-zinc-300 shadow-2xl shadow-zinc-300"
            >
                <Image src={logo} alt="Weather image" className="w-11/12 h-56 mx-auto rounded-lg object-cover mt-4" />
                <h1 className="text-2xl font-bold text-center mt-4">
                    Weather of the day
                </h1>
                <div className="flex justify-between items-center px-4 mt-4">
                    <h2 className="text-xl font-semibold">Temperature</h2>
                    <p className="text-xl font-semibold">{history[history?.length - 1]?.temperature}°C</p>
                </div>
                <div className="flex justify-between items-center px-4 mt-4">
                    <h2 className="text-xl font-semibold">Humidity</h2>
                    <p className="text-xl font-semibold">{history[history?.length - 1]?.humidity}%</p>
                </div>
                <div className="flex justify-between items-center px-4 mt-4">
                    <h2 className="text-xl font-semibold">Wind Speed</h2>
                    <p className="text-xl font-semibold">{history[history?.length - 1]?.windSpeed}m/s</p>
                </div>
                <motion.div
                    style={{
                        opacity: sheenOpacity,
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-zinc-100/50 via-zinc-100 to-zinc-100/50"
                />
            </motion.div>
        </div>
    );
};

export default Home;