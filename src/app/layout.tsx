import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ['latin'] });

import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navbar/Navbar';
import '../styles/global.scss';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'CampusEats',
  description: 'CampusEats'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Navigation />
        <Providers>{children}</Providers>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
