import { ethers } from "ethers";
import WeatherNFT from "@/abis/WeatherNFT.json"; // Importa el JSON completo

// Extrae la ABI desde el archivo JSON
const WeatherNFTAbi = WeatherNFT.abi;

const contractAddress = "0x61F461Ab541bC06a3123dd4d0112F9fFCedb9f00";
const AVALANCHE_RPC_URL = "https://avalanche-fuji.infura.io/v3/9eb78f13dc39478f8dc68f8ac3a571da";

// Crea el proveedor
export const getProvider = () => {
    try {
        return new ethers.JsonRpcProvider(AVALANCHE_RPC_URL);
    } catch (error) {
        console.error("Error al crear el proveedor:", error);
        throw error;
    }
};

// Crea una instancia del contrato
export const getContract = async () => {
    if (!window.ethereum) {
        alert("MetaMask no está instalado.");
        throw new Error("MetaMask no está instalado");
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(contractAddress, WeatherNFTAbi, signer);
};

// Función para mintear un NFT
export const mintWeatherNFT = async (
    to: string,
    name: string,
    description: string,
    image: string,
    humidity: number,
    windSpeed: number
) => {
    try {
        const contract = await getContract();
        const tx = await contract.mintWeatherNFT(to, name, description, image, humidity, windSpeed);
        await tx.wait();
        console.log(`NFT minteado con éxito: ${tx.hash}`);
    } catch (error) {
        console.error("Error al mintear el NFT:", error);
        throw error;
    }
};
