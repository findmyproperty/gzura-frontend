import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import OneTapLogin from '@/components/member/OneTapLogin';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OneTapLogin>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </OneTapLogin>
  );
}