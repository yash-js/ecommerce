import { Dog } from "lucide-react";
import { FooterNewsletter } from "./FooterNewsletter";
import { FooterLinks } from "./FooterLinks";
import { FooterSocial } from "./FooterSocial";
import { useUserStore } from "../../store/useUserStore";
import { useEffect } from "react";

export const Footer = () => {
  const { user } = useUserStore();


  return (
    <footer className={user?.role == "admin" ? "hidden" : "bg-[#1a1a1a] py-16"}>
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-wrap md:flex-nowrap gap-8 mb-12">
          <FooterNewsletter />
          <FooterLinks />
          <FooterSocial />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Dog className="w-8 h-8 text-[#febe03]" />
              <span className="text-2xl font-bold text-white">
                YellowWallDog
              </span>
            </div>
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>
                &copy; {new Date().getFullYear()} YellowWallDog. All rights
                reserved.
              </p>
              <p className="mt-1">
                <a
                  href="/privacy"
                  className="hover:text-[#febe03] transition-colors"
                >
                  Privacy Policy
                </a>
                {" • "}
                <a
                  href="/terms"
                  className="hover:text-[#febe03] transition-colors"
                >
                  Terms of Service
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
