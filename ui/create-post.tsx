import { upload } from "@/lib/bundlr";
import {
  type ProfileOwnedByMe,
  useCreatePost,
  ContentFocus,
  CollectPolicyType,
  type ReferencePolicy,
  useApolloClient,
} from "@lens-protocol/react-web";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  MetadataV2,
  NftOwnership,
  PublicationMainFocus,
  ContractType,
  LensGatedSDK,
  LensEnvironment,
} from "@lens-protocol/sdk-gated";
import { gql } from "@apollo/client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { toast } from "react-toastify";
import { wagmiClient } from "@/lib/wagmi-client";
import { LENS_HUB_ADDRESS, LENS_NETWORK } from "@/lib/constants";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { createPostQuery } from "@/lib/api";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ethers, utils } from "ethers";
import omitDeep from "omit-deep";
import LensHubAbi from "@/lib/abi/lens-hub-contract-abi.json";

interface IFormInput {
  post: string;
}

export function CreatePost({ publisher }: { publisher: ProfileOwnedByMe }) {
  const {
    execute: create,
    error,
    isPending,
  } = useCreatePost({ publisher, upload });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { mutate } = useApolloClient();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const postData: MetadataV2 = {
      version: "2.0.0",
      metadata_id: uuidv4(),
      content: data.post,
      locale: "en",
      mainContentFocus: PublicationMainFocus.TextOnly,
      description: "Gated publication",
      name: "Gated publication",
      attributes: [],
      appId: "mosaic",
    };

    let connector;
    if (isConnected) {
      await disconnectAsync();
    }
    try {
      ({ connector } = await connectAsync());
    } catch (error) {
      toast.error("Error connecting to wallet");
      console.error(error);
    }

    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();

      const nftAccessCondition: NftOwnership = {
        contractAddress: LENS_HUB_ADDRESS,
        chainID: LENS_NETWORK === "mainnet" ? 137 : 80001,
        contractType: ContractType.Erc721,
        tokenIds: ["32889"],
      };

      const sdk = await LensGatedSDK.create({
        provider: wagmiClient.provider,
        signer,
        env:
          LENS_NETWORK === "mainnet"
            ? LensEnvironment.Polygon
            : LensEnvironment.Mumbai,
      });

      await sdk.connect({
        address: await signer.getAddress(), // your signer's wallet address
        env: LensEnvironment.Mumbai,
      });

      const { contentURI, encryptedMetadata } = await sdk.gated.encryptMetadata(
        postData,
        publisher.id,
        {
          nft: nftAccessCondition,
        }, // or any other access condition object
        upload
      );

      const typedResult = await mutate({
        mutation: gql(createPostQuery),
        variables: {
          profileId: publisher.id,
          url: contentURI,
        },
      });

      // @ts-ignore
      const typedData = typedResult.data.createPostTypedData.typedData;
      const lensHub = new ethers.Contract(LENS_HUB_ADDRESS, LensHubAbi, signer);
      const signature = await await signer._signTypedData(
        omitDeep(typedData.domain, "__typename"),
        omitDeep(typedData.types, "__typename"),
        omitDeep(typedData.value, "__typename")
      );
      const { v, r, s } = utils.splitSignature(signature);

      const result = await lensHub.postWithSig({
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="post" className="block text-sm font-medium">
        Create post
      </label>
      <div className="mt-2">
        <textarea
          {...register("post", { required: true })}
          rows={4}
          name="post"
          id="post"
          className="textarea-bordered textarea-primary textarea textarea-sm w-full focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
          defaultValue={""}
        />
      </div>
      <span className="text-error text-sm">
        {errors.post && <p>Post is required.</p>}
      </span>
      <div className="mt-2 flex justify-end">
        <button type="submit" className="btn-primary btn-sm btn normal-case">
          Post
        </button>
      </div>
    </form>
  );
}
