import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { getDoc } from "firebase/firestore";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase/client";
import { User, UserContextType, UserInfo } from "../types/user";
import { ConverToPokemonArray } from "./pokemon";
import {
  deleteUser,
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { login } from "./auth";

export const updateUser = (
  id: string | undefined,
  data: Partial<Omit<User, "id" | "createdAt">>
): Promise<void> => {
  const ref = doc(db, `users/${id}`);
  return updateDoc(ref, data);
};

export const GetUserInfo = (userId: string | undefined) => {
  async function fetchUserInfo(): Promise<UserInfo> {
    if (userId) {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          name: docSnap.data().name,
          comment: docSnap.data().comment,
          pokemons: ConverToPokemonArray(docSnap.data().pokemons),
        };
      }
    }
    return {
      name: "",
      comment: "",
      pokemons: [],
    };
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserInfo().then(setUserInfo);
    }
  }, [userId]);

  if (!userInfo) return null;

  return userInfo;
};

type FailInfo = {
  isSuccess: boolean;
  errorMessage?: string;
};

export const DeleteUser = async (
  user: UserContextType
): Promise<FailInfo | undefined> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    // 最近サインインしていないとエラーになってしまうので、再認証してクレデンシャルを取得
    login().then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      reauthenticateWithCredential(currentUser, credential!)
        .then(() => {
          // User re-authenticated.
          deleteUser(currentUser)
            .then(() => {
              // User deleted.
              if (user?.id) {
                deleteDoc(doc(db, "users", user.id));
              }
              router.push("/");
              console.log("OK");
              return { isSuccess: true };
            })
            .catch((error) => {
              // An error ocurred
              return {
                isSuccess: false,
                errorMessage: "アカウントの削除に失敗しました",
              };
            });
        })
        .catch((error) => {
          // An error ocurred
          return {
            isSuccess: false,
            errorMessage: "何らかのエラーが発生しました",
          };
        });
    });
  }
  return undefined;
};