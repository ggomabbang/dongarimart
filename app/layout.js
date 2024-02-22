import './global.css';
import { Inter } from 'next/font/google';

import AuthSession from "./AuthSession.jsx";
import Navbar from './component/Navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "동아리마트",
  description: "우리학교 동아리를 찾아보세요",
  viewport: "width=device-width, initial-scale=1"
};

export default function rootLayout({ children }) {
  return (
    <html lang="ko">
        <body className={inter.className}>
          <AuthSession>
            <Navbar/>
            {children}
            <footer>
              <p>동아리 MART의 로고에는 (주)여기어때컴퍼니가 제공한 여기어때 잘난체가 적용되어 있습니다.</p>
            </footer>
          </AuthSession>
        </body>
    </html>
  )
}