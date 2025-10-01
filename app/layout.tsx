import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import Chatbot from '@/components/Chatbot';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FastDeal - Marketplace d'électronique d'occasion",
  description: "Achetez et vendez des smartphones, tablettes, ordinateurs et montres connectées d'occasion en toute confiance sur FastDeal.",
  keywords: "électronique, occasion, smartphone, tablette, ordinateur, montre connectée, achat, vente",
  authors: [{ name: "FastDeal Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "FastDeal - Marketplace d'électronique d'occasion",
    description: "Achetez et vendez des appareils électroniques d'occasion en toute confiance",
    type: "website",
    locale: "fr_FR",
    siteName: "FastDeal",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastDeal - Marketplace d'électronique d'occasion",
    description: "Achetez et vendez des appareils électroniques d'occasion en toute confiance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Cart />
        <Chatbot />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#065f46',
              },
            },
            error: {
              style: {
                background: '#dc2626',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
