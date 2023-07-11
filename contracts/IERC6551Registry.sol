// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {ISuperfluidToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC6551Registry} from "./IERC6551Registry.sol";

// Superfluid CFA
// Polygon: 0x6EeE6060f715257b970700bc2656De21dEdF074C
// Mumbai: 0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873

// SuperToken (fDAIx / DAIx)
// Polygon: 0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2
// Mumbai: 0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f

// LensHub
// Polygon: 0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d
// Mumbai: 0x60Ae865ee4C725cd04353b5AAb364553f56ceF82

// FlowRate
// 2 / mo: 761035007610
// 5 / mo: 1902587519025
// 10 / mo: 3805175038051

// ChainId
// Polyton: 137
// Mumbai: 80001

contract Premiere {
    uint private chainID = 80001;

    address private lensHubAddress = 0x60Ae865ee4C725cd04353b5AAb364553f56ceF82;

    IConstantFlowAgreementV1 private cfa =
        IConstantFlowAgreementV1(0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873);
    ISuperfluidToken private superToken =
        ISuperfluidToken(0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f);
    IERC721 private lensHub = IERC721(lensHubAddress);
    IERC6551Registry private tbaRegistry =
        IERC6551Registry(0x02101dfB77FDE026414827Fdc604ddAF224F0921);
    int96 minFlowRate = 1902587519025;

    function checkFlow(
        address _owner,
        uint256 _id
    ) internal view returns (uint256) {
        address tba = IERC6551Registry(tbaRegistry).account(
            0x2D25602551487C3f3354dD80D76D54383A243358,
            chainID,
            lensHubAddress,
            _id,
            0
        );

        (, int96 flowRate, , ) = cfa.getFlow(superToken, _owner, tba);
        address owner = lensHub.ownerOf(_id);

        if (flowRate >= minFlowRate || _owner == owner) {
            return 1;
        } else {
            return 0;
        }
    }

    function balanceOf(
        address _owner,
        uint256 _id
    ) external view returns (uint256) {
        return checkFlow(_owner, _id);
    }

    function balanceOfBatch(
        address[] calldata _owners,
        uint256[] calldata _ids
    ) external view returns (uint256[] memory) {
        uint balance = checkFlow(_owners[0], _ids[0]);

        uint256[] memory result = new uint256[](1);
        result[0] = balance;

        return result;
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
