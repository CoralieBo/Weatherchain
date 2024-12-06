import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import abi from '../../abis/WeatherNFT.json';

const contractAddress = "0xE9e1AF4A0353357920ECEf276B94687C0009764D";

export function useGetWeatherHistoryByDate() {
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState('');

    const { data, isError, isLoading, error: readError, isSuccess } = useReadContract({
        address: contractAddress,
        abi: abi,
        functionName: 'getWeatherImagesURL',
    });

    useEffect(() => {
        if (isError && readError) {
            setError(readError.message);
        } else if (data) {
            setImages(data as string[]);
        }
    }, [data, isError, readError]);

    return { history, isLoading, isError, error, isSuccess };
}