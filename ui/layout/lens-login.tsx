import {
  useActiveProfile,
  useActiveWallet,
  useWalletLogin,
  useWalletLogout,
} from "@lens-protocol/react-web";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { getPictureURL } from "@/lib/get-picture-url";
import { truncateAddr } from "@/lib/truncate-address";

import { LensProfiles } from "./lens-profiles";

export function LensLogin() {
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();
  const { execute: logout } = useWalletLogout();
  const { data: wallet } = useActiveWallet();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const { data: activeProfile } = useActiveProfile();

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();
      await login(signer);
    }
  };

  useEffect(() => {
    loginError && toast.error(loginError.message);
  }, [loginError]);

  return (
    <>
      {wallet ? (
        activeProfile ? (
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn-primary btn-sm btn flex flex-nowrap normal-case"
            >
              <div className="relative h-5 w-5">
                <Image
                  src={getPictureURL(activeProfile)}
                  alt={activeProfile.handle}
                  fill
                  sizes="(max-width: 20px) 100vw"
                  className="rounded-full object-cover"
                />
              </div>
              {activeProfile?.handle}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
            >
              <LensProfiles />
              <li>
                <a onClick={logout}>Log out</a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn-primary btn-sm btn flex flex-nowrap whitespace-nowrap normal-case"
            >
              {truncateAddr(wallet.address)}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
            >
              <LensProfiles />
              <li>
                <a onClick={logout}>Log out</a>
              </li>
            </ul>
          </div>
        )
      ) : (
        <button
          className="btn-primary btn-sm btn whitespace-nowrap normal-case"
          disabled={isLoginPending}
          onClick={onLoginClick}
        >
          Log in
        </button>
      )}
    </>
  );
}
