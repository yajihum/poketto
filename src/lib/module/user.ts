import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { getDoc } from "firebase/firestore";
import router from "next/router";
import { db } from "../../firebase/client";
import { User, UserContextType } from "../../types/user";
import { ConverToPokemonArray } from "./pokemon";
import {
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { login } from "../auth";
import fixedNames from "../fixed-name";
import { JSON } from "../../types/APIResponse";

export const updateUser = (
  id: string | undefined,
  data: Partial<Omit<User, "id" | "createdAt">>
): Promise<void> => {
  const ref = doc(db, `users/${id}`);
  return updateDoc(ref, data);
};

export const fetchUserInfo = async (
  userId: string
): Promise<JSON | undefined> => {
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
  return undefined;
};

export const DeleteUser = async (user: UserContextType): Promise<void> => {
  const f = fixedNames;
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    // 最近サインインしていないとエラーになってしまうので、再認証してクレデンシャルを取得
    login().then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      reauthenticateWithCredential(currentUser, credential!)
        .then(() => {
          deleteUser(currentUser)
            .then(() => {
              if (user?.id) {
                deleteDoc(doc(db, "users", user.id));
              }
              router.push("/");
            })
            .catch((e) => {
              throw new Error(f.ERR_ACCOUT_FAIL_REMOVE, e);
            });
        })
        .catch((e) => {
          throw new Error(f.ERR_SOMETHING, e);
        });
    });
  }
  return undefined;
};
