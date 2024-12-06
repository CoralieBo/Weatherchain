// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Weather is ERC721URIStorage, Ownable{
   
    enum WeatherCondition { Sunny, Rainy, Cloudy, Snowy }

    struct Data {
        uint8 temperature;
        uint8 humidity;
        uint16 windSpeed;
        WeatherCondition condition;
        uint256 timestamp;
    }

    uint256 public tokenIdCounter;

    mapping(uint64 => uint256) internal dateToTokenId;
    mapping(uint256 => Data[]) internal weatherHistory;
    mapping(WeatherCondition => string) internal weatherImageURLs;

    event NFTMinted(uint256 tokenId, uint64 date);
    event WeatherMetadataUpdated(uint256 tokenId, Data data);
    event WeatherImageURLUpdated(WeatherCondition condition, string imageURL);

    constructor() ERC721("WeatherNFT", "WNFT") Ownable(msg.sender) {
        weatherImageURLs[WeatherCondition.Sunny] = "https://www.buzzwebnet.com/wp-content/uploads/2020/06/soleil-8.jpg";
        weatherImageURLs[WeatherCondition.Rainy] = "https://i0.wp.com/www.leconomistemaghrebin.com/wp-content/uploads/2020/09/pluies.jpg?fit=700%2C405&ssl=1";
        weatherImageURLs[WeatherCondition.Cloudy] = "https://s.w-x.co/util/image/w/fr-ete-soleil.jpg?crop=16:9&width=480&format=pjpg&auto=webp&quality=60";
        weatherImageURLs[WeatherCondition.Snowy] = "https://meteobassenormandie.fr/wp-content/uploads/2020/12/XVM7c94a5d8-1e71-11e9-a628-f5feed317e99-1.jpg";
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function getConditionName(WeatherCondition condition) internal pure returns (string memory) {
        if (condition == WeatherCondition.Sunny) return "Sunny";
        if (condition == WeatherCondition.Rainy) return "Rainy";
        if (condition == WeatherCondition.Cloudy) return "Cloudy";
        if (condition == WeatherCondition.Snowy) return "Snowy";
        return "";
    }

    function mintNFT(uint64 date) external onlyOwner {
        require(dateToTokenId[date] == 0, "Token already exist on this date");
        uint256 newTokenId = ++tokenIdCounter;
        dateToTokenId[date] = newTokenId;
        _safeMint(owner(), newTokenId);
        emit NFTMinted(newTokenId, date);
    }

    function updateWeatherMetadata(uint256 tokenId, Data memory data) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        Data[] storage history = weatherHistory[tokenId];
        for (uint i = 0; i < history.length; i++) {
            if (history[i].timestamp == data.timestamp) {
                revert("Data with the same timestamp already exists");
            }
        }
        
        string memory image = weatherImageURLs[data.condition];
        string memory temperatureStr = Strings.toString(data.temperature);
        string memory humidityStr = Strings.toString(data.humidity);
        string memory windSpeedStr = Strings.toString(data.windSpeed);
        string memory timestampStr = Strings.toString(data.timestamp);

        string memory newMetadata = string(abi.encodePacked(
            '{"temperature":"', temperatureStr, '",',
            '"humidity":"', humidityStr, '",',
            '"windSpeed":"', windSpeedStr, '",',
            '"image":"', image, '",',
            '"condition":"', getConditionName(data.condition), '",',
            '"timestamp":"', timestampStr, '"}'
        ));
        
        weatherHistory[tokenId].push(data);
        _setTokenURI(tokenId, newMetadata);
        emit WeatherMetadataUpdated(tokenId, data);
    }

    function setWeatherImageURL(WeatherCondition condition, string memory imageURL) external onlyOwner {
        weatherImageURLs[condition] = imageURL;
        emit WeatherImageURLUpdated(condition, imageURL);
    }

    function getWeatherImageURL(WeatherCondition condition) external view returns (string memory) {
        return weatherImageURLs[condition];
    }

    function getWeatherHistoryById(uint256 tokenId) external view returns (Data[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return weatherHistory[tokenId];
    }

    function getWeatherHistoryByDate(uint64 date) external view returns (Data[] memory) {
        require(dateToTokenId[date] != 0, "No token found for this date");
        return weatherHistory[dateToTokenId[date]];
    }
}