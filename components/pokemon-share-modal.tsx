import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { PokeType } from "../types/pokemon";
import Button from "./button";
import Pokemons from "./pokemons";
import { LineIcon, TwitterIcon } from "react-share";

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userName: string;
  pokemons: PokeType[];
  isOpen: boolean;
};

const PokeShareModal = ({ userName, pokemons, isOpen, setIsOpen }: Props) => {
  const [isShow, setIsShow] = useState(isOpen);

  const pokeNameArray: string[] = [];

  pokemons.forEach((poke) => {
    pokeNameArray.push("💞" + poke.name);
  });

  const pokemonStr: string = pokeNameArray.join("\n");
  const dataText = `${userName}さんがすきなポケモンは...\n\n${pokemonStr}\n\n`;
  const [url, setUrl] = useState("");

  useEffect(() => {
    const uri = new URL(window.location.href);
    setUrl(uri.origin);
  }, []);

  function closeModal() {
    setIsShow(false);
    setIsOpen(false);
  }

  useEffect(() => {
    setIsShow(isOpen);
  }, [isOpen]);

  return (
    <Transition appear show={isShow} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="box-content flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle font-dot shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="mt-3 text-lg font-semibold leading-6 text-gray-900"
                >
                  <p>{userName}さんがすきなポケモン</p>
                </Dialog.Title>
                <Dialog.Description>
                  <div className="mt-4">
                    <Pokemons
                      pokemons={pokemons}
                      isEdit={false}
                      isShare
                    ></Pokemons>
                  </div>
                </Dialog.Description>
                <div className="mt-10 text-white">
                  <Button className="mx-4">
                    <Link
                      href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(
                        dataText
                      )}`}
                      data-show-count="false"
                      target="_blank"
                    >
                      <TwitterIcon size={50} round></TwitterIcon>
                    </Link>
                  </Button>
                  <Button className="mx-4">
                    <Link
                      href={`https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(
                        dataText
                      )}`}
                      data-show-count="false"
                      target="_blank"
                    >
                      <LineIcon size={50} round></LineIcon>
                    </Link>
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PokeShareModal;
