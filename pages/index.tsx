import Head from 'next/head'
import Layout from '../components/layout'
import {Container} from "@material-ui/core"
import styles from '../styles/Home.module.css'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ListAltIcon from '@material-ui/icons/ListAlt';
import HomeCard from '../components/home/HomeCard'
import {walletCardI} from "../types";

export default function Home():JSX.Element {
  const menuList:walletCardI[] = [
                                  {
                                    title:"Wallet List",
                                    about:"All of your wallets and transactions",
                                    avatar:<AccountBalanceWalletIcon />,
                                    linkTo:"wallet-list"
                                  },
                                  {
                                    title:"Categories",
                                    about:"Manage categories of income and expenses",
                                    avatar: <ListAltIcon />,
                                    linkTo:"categories"
                                  }
                                ]
  return (
    <Layout>
    <div className={styles.container}>
      <Head>
        <title>Cash Flow App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <Container>
        <h2 className={styles.title}>
          Welcome to Cash Flow App
        </h2>

        <p className={styles.description}>
          Choose your menu below : 
        </p>

        <div className={styles.grid}>
        {
          menuList.map((d, i)=><HomeCard key={i} {...d} />)
        }
        </div>
      </Container>
      </main>
    </div>
    </Layout>
  )
}
