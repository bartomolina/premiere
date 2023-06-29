import { upload } from "@/lib/bundlr";
import {
  type ProfileOwnedByMe,
  useCreatePost,
  ContentFocus,
  CollectPolicyType,
  type ReferencePolicy,
} from "@lens-protocol/react-web";
import { useForm, SubmitHandler } from "react-hook-form";

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

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await create({
      content: data.post,
      contentFocus: ContentFocus.TEXT_ONLY,
      locale: "en",
    });
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
