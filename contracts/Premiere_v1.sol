// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {ISuperfluidToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// Superfluid CFA
// Polygon: 0x6EeE6060f715257b970700bc2656De21dEdF074C
// Mumbai: 0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873

// SuperToken (fDAIx / DAIx)
// Polygon: 0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2
// Mumbai: 0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f

// LensHub
// Polygon: 0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d
// Mumbai: 0x60Ae865ee4C725cd04353b5AAb364553f56ceF82

contract Premiere {
    IConstantFlowAgreementV1 private cfa =
        IConstantFlowAgreementV1(0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873);
    ISuperfluidToken private superToken =
        ISuperfluidToken(0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f);
    IERC721 private lensHub =
        IERC721(0x60Ae865ee4C725cd04353b5AAb364553f56ceF82);

    function isSubscribed(
        address sender,
        address receiver,
        string memory profileId,
        string memory minFlowRate,
        string memory maxTimestamp
    ) public view returns (bool subscribed) {
        subscribed = false;

        (uint256 timestamp, int96 flowRate, , ) = cfa.getFlow(
            superToken,
            sender,
            receiver
        );
        address owner = lensHub.ownerOf(uint(parseInt(profileId)));

        int256 _minFlowRate = int(parseInt(minFlowRate));
        uint256 _maxTimestamp = parseInt(maxTimestamp);

        if (
            (flowRate >= _minFlowRate &&
                (_maxTimestamp == 0 || timestamp < _maxTimestamp)) ||
            sender == owner
        ) {
            subscribed = true;
        }
    }

    function parseInt(
        string memory _a
    ) internal pure returns (uint256 _parsedInt) {
        return parseInt(_a, 0);
    }

    function parseInt(
        string memory _a,
        uint _b
    ) internal pure returns (uint256 _parsedInt) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        bool decimals = false;
        for (uint i = 0; i < bresult.length; i++) {
            if (
                (uint(uint8(bresult[i])) >= 48) &&
                (uint(uint8(bresult[i])) <= 57)
            ) {
                if (decimals) {
                    if (_b == 0) {
                        break;
                    } else {
                        _b--;
                    }
                }
                mint *= 10;
                mint += uint(uint8(bresult[i])) - 48;
            } else if (uint(uint8(bresult[i])) == 46) {
                decimals = true;
            }
        }
        if (_b > 0) {
            mint *= 10 ** _b;
        }
        return mint;
    }
}
