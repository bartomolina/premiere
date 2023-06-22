import {
  useActiveProfile,
  useActiveWallet,
  useWalletLogin,
  useWalletLogout,
} from "@lens-protocol/react-web";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { getAvatar } from "@/lib/get-avatar";
import { truncateAddr } from "@/lib/truncate-address";
import { wagmiNetwork } from "@/lib/wagmi-client";

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
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({
    chainId: wagmiNetwork.id,
  });

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

  useEffect(() => {
    if (switchNetwork && chain && chain.id !== wagmiNetwork.id) {
      switchNetwork();
    }
  }, [chain, switchNetwork]);

  return (
    <>
      {wallet ? (
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn-primary btn-sm btn flex flex-nowrap whitespace-nowrap normal-case"
          >
            {activeProfile ? (
              <>
                <div className="relative h-5 w-5">
                  <Image
                    src={getAvatar(activeProfile)}
                    alt={activeProfile.handle}
                    fill
                    sizes="(max-width: 20px) 100vw"
                    className="rounded-full object-cover"
                  />
                </div>
                {activeProfile?.handle}
              </>
            ) : (
              <>{truncateAddr(wallet.address)}</>
            )}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box z-10 w-52 bg-base-100 p-2 shadow"
          >
            <LensProfiles />
            <li>
              <a onClick={logout}>Log out</a>
            </li>
          </ul>
        </div>
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
