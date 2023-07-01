import * as LitJsSdk from "@lit-protocol/lit-node-client";

import { CHAIN, MOSAIC_LIT_ACC_CONTRACT } from "./constants";

const conditions = (address: string, profileId: string) => [
  {
    contractAddress: MOSAIC_LIT_ACC_CONTRACT,
    functionName: "isSubscribed",
    functionParams: [":userAddress", address, profileId],
    functionAbi: {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "string",
          name: "profileId",
          type: "string",
        },
      ],
      name: "isSubscribed",
      outputs: [
        {
          internalType: "bool",
          name: "subscribed",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    chain: CHAIN,
    returnValueTest: {
      key: "subscribed",
      comparator: "=",
      value: "true",
    },
  },
];

const blobToBase64 = (blob: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

export const prepareSig = async () => {
  const client = new LitJsSdk.LitNodeClient({ debug: false });
  await client.connect();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.litNodeClient = client;
  await LitJsSdk.checkAndSignAuthMessage({
    chain: CHAIN,
  });
};

export const encrypt = async (
  content: string,
  address: string,
  profileId: string
) => {
  const client = new LitJsSdk.LitNodeClient({ debug: false });
  await client.connect();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.litNodeClient = client;
  const authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain: CHAIN,
  });
  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    content
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
    evmContractConditions: conditions(address, profileId),
    symmetricKey,
    authSig,
    chain: CHAIN,
  });

  return {
    encryptedString: (await blobToBase64(encryptedString)) as string,
    encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
      encryptedSymmetricKey,
      "base16"
    ),
  };
};

export const decrypt = async (
  content: string,
  encryptedSymmetricKey: string,
  address: string,
  profileId: string
) => {
  const fContent = await fetch(content);
  const encryptedBlob = await fContent.blob();
  const client = new LitJsSdk.LitNodeClient({ debug: false });
  await client.connect();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.litNodeClient = client;
  const authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain: CHAIN,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const symmetricKey = await window.litNodeClient.getEncryptionKey({
    evmContractConditions: conditions(address, profileId),
    toDecrypt: encryptedSymmetricKey,
    chain: CHAIN,
    authSig,
  });

  return await LitJsSdk.decryptString(encryptedBlob, symmetricKey);
};
