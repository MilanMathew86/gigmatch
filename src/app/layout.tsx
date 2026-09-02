import type { Metadata } from "next";
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomerFlowProvider } from "@/lib/customer-flow-context";
import { ProviderFlowProvider } from "@/lib/provider-flow-context";

export const metadata: Metadata = {
  title: "GigMatch — Find the right person for the right job",
  description:
    "GigMatch matches customers with suitable service providers based on skills, availability, location and experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased">
        <CustomerFlowProvider>
          <ProviderFlowProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ProviderFlowProvider>
        </CustomerFlowProvider>
      </body>
    </html>
  );
}
