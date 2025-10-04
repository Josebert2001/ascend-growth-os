import { Session } from "@supabase/supabase-js";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  session: Session;
}

export const Header = ({ session }: HeaderProps) => {
  return (
    <header className="fixed top-0 right-0 z-50 p-4">
      <UserMenu />
    </header>
  );
};
