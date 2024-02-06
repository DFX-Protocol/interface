import WalletProvider from "./wallets/WalletProvider";
import { render } from "@testing-library/react";

export function TestApp({ children }) {
  return <WalletProvider>{children}</WalletProvider>;
}

export function testHook(hook: () => void) {
  function Comp() {
    hook();

    return null;
  }

  render(
    <TestApp>
      <Comp />
    </TestApp>
  );
}
