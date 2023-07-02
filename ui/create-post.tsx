import { gql } from "@apollo/client";
import {
  appId,
  type ProfileOwnedByMe,
  useApolloClient,
} from "@lens-protocol/react-web";
import { MetadataV2, PublicationMainFocus } from "@lens-protocol/sdk-gated";
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

import LensHubAbi from "@/lib/abi/lens-hub-contract-abi.json";
import { createPostQuery } from "@/lib/api";
import { upload } from "@/lib/bundlr";
import { APP_ID, LENS_HUB_ADDRESS } from "@/lib/constants";
import { encrypt } from "@/lib/lit";

interface IFormInput {
  post: string;
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
    const { encryptedString, encryptedSymmetricKey } = await encrypt(
      data.post,
      tba,
      Number.parseInt(publisher.id, 16).toString()
    );

    const postData: MetadataV2 = {
      version: "2.0.0",
      metadata_id: uuidv4(),
      content: "This publication is gated.",
      locale: "en",
      mainContentFocus: PublicationMainFocus.TextOnly,
      description: "This publication is gated.",
      name: "This publication is gated.",
      attributes: [],
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
      const contentURI = await upload(postData);

      const typedResult = await mutate({
        mutation: gql(createPostQuery),
        variables: {
          profileId: publisher.id,
          url: contentURI,
        },
      });

      const typedData = typedResult.data.createPostTypedData.typedData;
      const lensHub = new ethers.Contract(LENS_HUB_ADDRESS, LensHubAbi, signer);
      const signature = await signer._signTypedData(
        omitDeep(typedData.domain, "__typename"),
        omitDeep(typedData.types, "__typename"),
        omitDeep(typedData.value, "__typename")
      );
      const { v, r, s } = utils.splitSignature(signature);

      const tx = await lensHub.postWithSig({
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

      await toast.promise(tx.wait(), {
        pending: "Posting",
        success: "Post published",
        error: "Error posting",
      });

      fetchPublications();
      reset();
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
          className="textarea-bordered textarea-primary textarea textarea-md w-full text-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
          defaultValue={""}
        />
      </div>
      <span className="text-sm text-error">
        {errors.post && <p>Post is required.</p>}
      </span>
      <div className="mt-2 flex justify-end">
        <button
          disabled={!isValid || isSubmitting}
          type="submit"
          className="btn-primary btn-sm btn normal-case"
        >
          Post
        </button>
      </div>
    </form>
  );
}
