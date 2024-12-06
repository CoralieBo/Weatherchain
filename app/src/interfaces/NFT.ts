import sun from "../app/images/sun.jpg";
import rain from "../app/images/rain.jpg";
import snow from "../app/images/snow.jpg";

export interface Inft {
    condition: number;
    humidity: number;
    temperature: number;
    timestamp: string;
    windSpeed: number;
}

export enum Condition {
    Sunny = "Sunny",
    Rainy = "Rainy",
    Cloudy = "Cloudy",
    Snowy = "Snowy"
}

export const images = [
    sun.src,
    rain.src,
    sun.src,
    snow.src
]