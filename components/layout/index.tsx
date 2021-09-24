import Head from 'next/head'
import TopNavigation from "./top-nav/TopNavigation";
import Footer from "./Footer";

const Layout = ({ children }:{ children:React.ReactNode}) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <TopNavigation />
      <div style={{maxWidth:"100vw", minHeight:"100vh"}}>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;