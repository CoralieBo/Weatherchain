import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import abi from '../../abis/WeatherNFT.json';
import { Inft } from '@/interfaces/NFT';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || "0xE9e1AF4A0353357920ECEf276B94687C0009764D";

export function useGetWeatherHistoryByDate(timestamp: number) {
  const [history, setHistory] = useState<Inft[]>([]);
  const [error, setError] = useState('');


  const { data, isError, isLoading, error: readError, isSuccess } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: 'getWeatherHistoryByDate',
    args: [timestamp]
  });

  useEffect(() => {
    if (isError && readError) {
      setError(readError.message);
    } else if (data) {
      setHistory(data as Inft[]);
    }
  }, [data, isError, readError]);

  return { history, isLoading, isError, error, isSuccess };
}