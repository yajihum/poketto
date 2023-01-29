import Layout from "../../components/layout";
import UserGuard from "../../guards/user-guard";
import { useAuth } from "../../context/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import React, { useEffect, useState } from "react";
import InputField from "../../components/input-field";
import Button from "../../components/button";
import TextareaField from "../../components/textarea-field";
import { GetUserInfo, updateUser } from "../../lib/user";
import DoneModal from "../../components/done-modal";
import Pokemons from "../../components/pokemons";
import { UserInfo } from "../../types/user";
import Meta from "../../components/meta";
import router from "next/router";

type Inputs = {
  name: string;
  comment: string;
};

const Mypage = () => {
  const user = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

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
        .catch((error) => {
          // 更新失敗
          setIsOpen(true);
        });
    }
    setIsOpen(false);
    setIsDone(false);
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
          <Meta title={`${userInfo?.name}さんのページ編集するよ～～ん`} />
          <div className="mx-6 mt-8 font-dot text-white md:mt-12">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="mb-8 font-medium caret-orange-400">
                <InputField
                  label="名前"
                  register={register("name", {
                    required: "必須です",
                    maxLength: {
                      value: 20,
                      message: "20文字以内にしてください",
                    },
                  })}
                  error={errors.name?.message}
                  className="form-input mb-3 mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></InputField>
                <TextareaField
                  label="コメント"
                  register={register("comment", {
                    maxLength: {
                      value: 500,
                      message: "500文字以内にしてください",
                    },
                  })}
                  error={errors.comment?.message}
                  placeholder="コメントを入力"
                  className="form-input mt-4 block w-full resize-none rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></TextareaField>
              </div>
              <div className="text-center font-dot text-white">
                {userInfo?.pokemons && userInfo.pokemons.length > 0 ? (
                  <Pokemons pokemons={userInfo.pokemons} isEdit></Pokemons>
                ) : (
                  <p className="mt-10 mb-20 text-lg font-medium md:mt-40 md:mb-52 md:text-3xl">
                    すきなポケモンの登録はありません
                  </p>
                )}
              </div>
              <div className="mt-32 flex justify-center">
                <Button
                  type="submit"
                  className="mx-2 rounded-full px-3 py-2 text-center text-xl font-medium hover:text-black md:text-3xl"
                >
                  ▽保存する
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
