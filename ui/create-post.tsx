import { gql } from "@apollo/client";
import {
  appId,
  type ProfileOwnedByMe,
  useApolloClient,
} from "@lens-protocol/react-web";
import { MetadataV2, PublicationMainFocus } from "@lens-protocol/sdk-gated";
import { signTypedData, waitForTransaction, writeContract } from "@wagmi/core";
import { ethers, utils } from "ethers";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import omitDeep from "omit-deep";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { lensHubAbi } from "@/lib/abi/lens-hub-contract-abi";
import { createPostQuery } from "@/lib/api";
import { upload } from "@/lib/bundlr";
import { APP_ID, LENS_HUB_ADDRESS, SUPERFLUID_TOKEN } from "@/lib/constants";
import { encrypt } from "@/lib/lit";

interface IFormInput {
  post: string;
  minFlowRate: string;
  maxTimestamp: string;
}

export function CreatePost({
  publisher,
  tba,
  fetchPublications,
}: {
  publisher: ProfileOwnedByMe;
  tba: `0x${string}`;
  fetchPublications: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IFormInput>();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { mutate } = useApolloClient();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const _minFlowRate = Math.floor(
      Number(ethers.utils.parseEther(data.minFlowRate)._hex) /
        (60 * 60 * 24 * (365 / 12))
    ).toString();

    const _maxTimestamp = data.maxTimestamp
      ? Math.floor(
          new Date().setDate(new Date().getDate() - 7) / 1000
        ).toString()
      : "";

    const { encryptedString, encryptedSymmetricKey } = await encrypt(
      data.post,
      tba,
      Number.parseInt(publisher.id, 16).toString(),
      _minFlowRate,
      _maxTimestamp
    );

    const postData: MetadataV2 = {
      version: "2.0.0",
      metadata_id: uuidv4(),
      content: "This publication is gated.",
      locale: "en",
      mainContentFocus: PublicationMainFocus.TextOnly,
      description: "This publication is gated.",
      name: "This publication is gated.",
      attributes: [
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          displayType: "string",
          value: _minFlowRate,
          traitType: "minFlowRate",
        },
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          displayType: "string",
          value: _maxTimestamp,
          traitType: "maxTimestamp",
        },
      ],
      appId: appId(APP_ID),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      encryptionParams: {
        encryptedFields: {
          content: encryptedString,
        },
        providerSpecificParams: {
          encryptionKey: encryptedSymmetricKey,
        },
        encryptionProvider: "LIT_PROTOCOL",
        accessCondition: {
          or: {
            criteria: [
              {
                profile: {
                  profileId: publisher.id,
                },
              },
              {
                profile: {
                  profileId: publisher.id,
                },
              },
            ],
          },
        },
      },
    };

    if (isConnected) {
      await disconnectAsync();
    }
    try {
      await connectAsync();
    } catch (error) {
      toast.error("Error connecting to wallet");
      console.error(error);
    }

    const contentURI = await upload(postData);

    const typedResult = await mutate({
      mutation: gql(createPostQuery),
      variables: {
        profileId: publisher.id,
        url: contentURI,
      },
    });

    const typedData = typedResult.data.createPostTypedData.typedData;

    const signature = await signTypedData({
      primaryType: "PostWithSig",
      domain: omitDeep(typedData.domain, "__typename"),
      types: omitDeep(typedData.types, "__typename"),
      message: omitDeep(typedData.value, "__typename"),
    });
    const { v, r, s } = utils.splitSignature(signature) as {
      v: number;
      r: `0x${string}`;
      s: `0x${string}`;
    };

    const { hash } = await writeContract({
      address: LENS_HUB_ADDRESS,
      functionName: "postWithSig",
      abi: lensHubAbi,
      args: [
        {
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
        },
      ],
    });

    await toast.promise(waitForTransaction({ hash, confirmations: 2 }), {
      pending: "Posting",
      success: "Post published",
      error: "Error posting",
    });

    fetchPublications();
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-5 text-sm">
      <label htmlFor="post" className="block font-medium">
        Create post
      </label>
      <div className="mt-2">
        <textarea
          {...register("post", { required: true })}
          rows={4}
          name="post"
          id="post"
          className="textarea-bordered textarea-primary textarea textarea-md w-full focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <input
              {...register("minFlowRate")}
              autoComplete="off"
              type="text"
              size={3}
              defaultValue={5}
              name="minFlowRate"
              id="minFlowRate"
              className="input-bordered input-primary input input-xs focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
            />
            <label htmlFor="minFlowRate" className="block">
              Min. {SUPERFLUID_TOKEN} / mo.
            </label>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <input
              {...register("maxTimestamp")}
              type="checkbox"
              size={4}
              defaultChecked={false}
              name="maxTimestamp"
              id="maxTimestamp"
              className="checkbox-primary checkbox checkbox-xs focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
            />
            <label htmlFor="maxTimestamp" className="block">
              Subscribed for &ge; 1 week
            </label>
          </div>
        </div>
        <div className="ml-4">
          <button
            disabled={!isValid || isSubmitting}
            type="submit"
            className="btn-primary btn-sm btn normal-case"
          >
            Post
          </button>
        </div>
      </div>
      <span className="flex justify-end text-error">
        {errors.post && <p>Post is required</p>}
      </span>
    </form>
  );
}
