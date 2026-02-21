import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden h-20 w-full border-t-2 border-slate-200 p-2 lg:block">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-evenly">
        <Button size="lg" variant="ghost" className="w-full">
          🌐Phishing
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          🔐Encryption
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          🔒Security
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          🛡️Strong Passwords
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          ⚡Social Engineering
        </Button>
      </div>
    </footer>
  );
};
