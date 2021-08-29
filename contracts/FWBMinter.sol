// SPDX-License-Identifier: MIT
pragma solidity^0.8.4;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FWBMinter is ERC721URIStorage, ERC721Enumerable {
    uint256 maxSupply = 10000;
    string baseURI;
    address admin;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        setBaseURI("ifps://");
        admin == msg.sender;
    }
    address[] public users;
        function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC721Enumerable, ERC721) {
        super._beforeTokenTransfer(from, to, amount);
    }

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    //FWB interface
    IERC20 FWB=IERC20(0x7B3205D43eb8931E2de7310A4535761FAf364A89);
    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        address owner = ERC721.ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId);

        // Clear approvals
        _approve(address(0), tokenId);

        _balances[owner] -= 1;
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
          }
    modifier onlyOwner() {
        require(admin == msg.sender, "Ownable: caller is not the owner");
        _;
              }
    function mint(
        string memory metadataURI, address
    ) public returns (uint256) {
        require(FWB.balanceOf(msg.sender) >= 75000000000000000000, "You need at least 75 $FWB in your wallet to mint!");
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _mint(msg.sender, id);
        _setTokenURI(id, metadataURI);
        return id;
    }
    function withdraw(address payable owner) public onlyOwner returns(bool) {
        owner.transfer(address(this).balance);
        return true;
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _setTokenURI(tokenId, _tokenURI);
    }

    function setBaseURI(string memory baseURI_) internal {
        baseURI = baseURI_;
    }


    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }


    mapping(uint256 => string) private _tokenURIs;
    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }
}
