import { Menu, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { useAuth } from "../../context/auth";
import { classNames } from "../../lib/class-names";
import { login, logout } from "../../lib/auth";
import MenuLink from "../ui/menu-link";
import Image from "next/image";
import fixedNames from "../../lib/fixed-name";

const f = fixedNames;
const links = [
  {
    label: f.BTN_GO_HOME,
    iconSrc: "/images/rioru.png",
    path: "/",
    isShow: true,
  },
  {
    label: f.BTN_LOOK_UP_REGION,
    iconSrc: "/images/togepi.png",
    path: "/regions",
    isShow: true,
  },
  {
    label: f.BTN_GO_MYPAGE,
    iconSrc: "/images/yogirasu.png",
    path: "/user/mypage",
    isShow: false,
  },
  {
    label: f.BTN_SHARE,
    iconSrc: "/images/karanakushi.png",
    path: "/share",
    isShow: false,
  },
];

const ListItem = ({
  active,
  iconSrc,
  label,
  isShow,
}: {
  active: boolean;
  iconSrc: string;
  label: string;
  isShow: boolean;
}) => {
  return (
    <>
      {isShow && (
        <span
          className={classNames(
            "flex items-center space-x-2 rounded p-2 text-left text-sm",
            active && "bg-orange-200 text-white"
          )}
        >
          <span
            className={classNames("", active ? "text-white" : "text-gray-500")}
          >
            <Image src={iconSrc} height={30} width={30} alt="poke" />
          </span>
          <span className="flex-1">{label}</span>
        </span>
      )}
    </>
  );
};

const UserMenu = () => {
  const user = useAuth();

  // 「マイページにいく」はログインしているときのみ表示
  // 後で変える
  links[2].isShow = user ? true : false;
  links[3].isShow = user ? false : true;

  return (
    <Menu as="div" className="mr-7 font-semibold text-gray-700">
      <Menu.Button className="block">
        <span className="text-3xl text-white">▽</span>
        {/* <Image src="/pokemon9.png" alt="" width={50} height={50}></Image> */}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-6 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b p-1">
            {links.map((link) => (
              <Menu.Item key={link.path}>
                {({ active }) => (
                  <MenuLink href={link.path}>
                    <ListItem
                      iconSrc={link.iconSrc}
                      label={link.label}
                      active={active}
                      isShow={link.isShow}
                    />
                  </MenuLink>
                )}
              </Menu.Item>
            ))}
          </div>
          <div className="p-1">
            {user && (
              <Menu.Item>
                {({ active }) => (
                  <button className="w-full" onClick={logout}>
                    <ListItem
                      iconSrc="/images/upa.png"
                      label={f.BTN_LOGOUT}
                      active={active}
                      isShow={user ? true : false}
                    ></ListItem>
                  </button>
                )}
              </Menu.Item>
            )}
            {!user && (
              <Menu.Item>
                {({ active }) => (
                  <button className="w-full" onClick={login}>
                    <ListItem
                      iconSrc="/images/rarutosu.png"
                      label={f.BTN_LOGIN}
                      active={active}
                      isShow={!user ? true : false}
                    ></ListItem>
                  </button>
                )}
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
