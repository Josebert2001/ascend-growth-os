import { Session } from "@supabase/supabase-js";

interface HeaderProps {
  session: Session;
}

export const Header = ({ session }: HeaderProps) => {
  return null; // Header removed for cleaner mobile-first UI
};
