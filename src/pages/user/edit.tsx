import Layout from "../../components/layout/layout";
import UserGuard from "../../guards/user-guard";
import { useAuth } from "../../context/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import InputField from "../../components/field/input-field";
import Button from "../../components/ui/button";
import TextareaField from "../../components/field/textarea-field";
import { GetUserInfo, updateUser } from "../../lib/module/user";
import DoneModal from "../../components/module/modal/done-modal";
import Pokemons from "../../components/module/pokemons";
import { UserInfo } from "../../types/user";
import Meta from "../../components/layout/meta";
import { z } from "zod";
import { customErrorMap } from "../../lib/zErrorMap";
import fixedNames from "../../lib/fixed-name";
import { CheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";

const InputSchema = z.object({
  name: z.string({ errorMap: customErrorMap }).min(1),
  comment: z.string({ errorMap: customErrorMap }).max(50).optional(),
});

type Inputs = z.infer<typeof InputSchema>;

const Mypage = () => {
  const user = useAuth();
  const f = fixedNames;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(InputSchema),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (user?.id) {
      updateUser(user?.id, {
        name: data.name,
        comment: data.comment,
      })
        .then(() => {
          // 更新完了
          setIsOpen(true);
          setIsDone(true);
        })
        .catch((e) => {
          // 更新失敗
          setIsOpen(true);
          throw new Error("更新処理の失敗", e);
        });
    }
  };

  let userInfo: UserInfo | null = null;

  // これ必ずアサーション使って強制的にstringにするの良くない。いい方法を後で知る
  const userId: string = user?.id as string;
  userInfo = GetUserInfo(userId);

  useEffect(() => {
    reset({ name: userInfo?.name, comment: userInfo?.comment });
  }, [reset, userInfo?.name, userInfo?.comment]);

  if (!userInfo) return null;

  return (
    <UserGuard>
      {(user) => (
        <Layout>
          <Meta title={userInfo?.name + f.USER_PAGE_EDIT} />
          <div className="mx-5 mt-4 rounded-3xl bg-white bg-opacity-20 px-8 py-2 font-dot text-white md:mx-0">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="mx-4 mb-8 font-medium caret-orange-400">
                <InputField
                  label={f.LABEL_NAME}
                  register={register("name")}
                  placeholder={f.PLACE_NAME}
                  className="form-input mb-3 mt-1 block w-full rounded-md text-black outline outline-offset-0 outline-teal-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></InputField>
                <TextareaField
                  label={f.LABEL_COMMENT}
                  register={register("comment")}
                  error={errors.comment?.message}
                  placeholder={f.PLACE_COMMENT}
                  className="form-input mt-4 w-full resize-none rounded-md py-5 text-black outline outline-offset-0 outline-teal-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 md:py-8"
                ></TextareaField>
              </div>
              <div className="text-center font-dot text-white">
                {userInfo?.pokemons && userInfo.pokemons.length > 0 ? (
                  <Pokemons pokemons={userInfo.pokemons} isEdit></Pokemons>
                ) : (
                  <div className="grid grid-rows-2">
                    <p className="mt-10 mb-20 text-base font-medium md:text-2xl">
                      {f.NON_POKE}
                    </p>
                    <Image
                      src="/images/pochama.png"
                      height={80}
                      width={80}
                      alt="poke"
                      className="justify-self-center brightness-110"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-center md:mt-12">
                <Button
                  type="submit"
                  className="mx-2 mb-10 rounded-full border-2 border-teal-300 bg-white px-3 py-2 text-center text-xl font-medium text-teal-300 opacity-95 hover:text-teal-100 md:text-2xl"
                >
                  <CheckIcon className="inline-block h-8 w-8 align-top" />
                  {f.BTN_SAVE}
                </Button>
                <DoneModal
                  setIsOpen={setIsOpen}
                  isOpen={isOpen}
                  isDone={isDone}
                  isMyPage
                ></DoneModal>
              </div>
            </form>
          </div>
        </Layout>
      )}
    </UserGuard>
  );
};

export default Mypage;
