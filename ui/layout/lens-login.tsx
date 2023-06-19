import {
  useActiveProfile,
  useActiveWallet,
  useWalletLogin,
  useWalletLogout,
} from "@lens-protocol/react-web";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { LensProfiles } from "./lens-profiles";
import { getPictureURL } from "@/lib/get-picture-url";
import Image from "next/image";
import { truncateAddr } from "@/lib/truncate-address";

export function LensLogin() {
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();
  const { execute: logout, isPending: isLogoutPending } = useWalletLogout();
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
              className="flex btn-sm btn btn-primary normal-case flex-nowrap"
            >
              <div className="w-5 h-5 relative">
                <Image
                  src={getPictureURL(activeProfile)}
                  alt={activeProfile.handle}
                  fill
                  sizes="(max-width: 20px) 100vw"
                  className="object-cover rounded-full"
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
              className="flex btn-sm btn btn-primary normal-case flex-nowrap whitespace-nowrap"
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
