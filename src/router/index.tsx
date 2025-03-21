import { createHashRouter } from "react-router-dom"
import LotteryPage from "../components/Lottery/LotteryPage"

// 第一階段路由
const phaseOneRoutes = [
  {
    path: "/phase-1-1",
    element: (
      <LotteryPage
        title='★ 第一階段摸彩 ★'
        subtitle='NO.1-10獎 現金$3,000元，共10位'
        totalWinners={10}
        apiEndpoint='/employee/get-employees-by-group-one'
        prizeName='第一階段 NO.1-10獎 現金$3,000元'
      />
    ),
  },
  {
    path: "/phase-1-2",
    element: (
      <LotteryPage
        title='★ 第一階段摸彩 ★'
        subtitle='NO.11-20獎 現金$5,000元，共10位'
        totalWinners={10}
        apiEndpoint='/employee/get-employees-by-group-one'
        prizeName='第一階段 NO.11-20獎 現金$5,000元'
      />
    ),
  },
  {
    path: "/phase-1-3",
    element: (
      <LotteryPage
        title='★ 第一階段摸彩 ★'
        subtitle='NO.21獎 現金$10,000元，共1位'
        totalWinners={1}
        apiEndpoint='/employee/get-employees-by-group-one'
        prizeName='第一階段 NO.21獎 現金$10,000元'
      />
    ),
  },
]

// 第二階段路由
const phaseTwoRoutes = [
  {
    path: "/phase-2-1",
    element: (
      <LotteryPage
        title='★ 第二階段摸彩 ★'
        subtitle='NO.1-10獎 現金$5,000元，共10位'
        totalWinners={10}
        apiEndpoint='/employee/get-employees-by-group-two'
        prizeName='第二階段 NO.1-10獎 現金$5,000元'
      />
    ),
  },
  {
    path: "/phase-2-2",
    element: (
      <LotteryPage
        title='★ 第二階段摸彩 ★'
        subtitle='NO.11-20獎 現金$8,000元，共10位'
        totalWinners={10}
        apiEndpoint='/employee/get-employees-by-group-two'
        prizeName='第二階段 NO.11-20獎 現金$8,000元'
      />
    ),
  },
  {
    path: "/phase-2-3",
    element: (
      <LotteryPage
        title='★ 第二階段摸彩 ★'
        subtitle='NO.21-22獎 現金$10,000元，共2位'
        totalWinners={2}
        apiEndpoint='/employee/get-employees-by-group-two'
        prizeName='第二階段 NO.21-22獎 現金$10,000元'
      />
    ),
  },
  {
    path: "/phase-2-4",
    element: (
      <LotteryPage
        title='★ 第二階段摸彩 ★'
        subtitle='NO.23-24獎 現金$20,000元，共2位'
        totalWinners={2}
        apiEndpoint='/employee/get-employees-by-group-two'
        prizeName='第二階段 NO.23-24獎 現金$20,000元'
      />
    ),
  },
]

// 第三階段路由
const phaseThreeRoutes = [
  {
    path: "/phase-3-1",
    element: (
      <LotteryPage
        title='★ 第三階段摸彩 ★'
        subtitle='NO.1-10獎 現金$8,000元，共10位'
        totalWinners={10}
        apiEndpoint='/employee/get-employees-by-group-three'
        prizeName='第三階段 NO.1-10獎 現金$8,000元'
      />
    ),
  },
  {
    path: "/phase-3-2",
    element: (
      <LotteryPage
        title='★ 第三階段摸彩 ★'
        subtitle='NO.11-15獎 現金$10,000元，共5位'
        totalWinners={5}
        apiEndpoint='/employee/get-employees-by-group-three'
        prizeName='第三階段 NO.11-15獎 現金$10,000元'
      />
    ),
  },
  {
    path: "/phase-3-3",
    element: (
      <LotteryPage
        title='★ 第三階段摸彩 ★'
        subtitle='NO.16-20獎 現金$15,000元，共5位'
        totalWinners={5}
        apiEndpoint='/employee/get-employees-by-group-three'
        prizeName='第三階段 NO.16-20獎 現金$15,000元'
      />
    ),
  },
  {
    path: "/phase-3-4",
    element: (
      <LotteryPage
        title='★ 第三階段摸彩 ★'
        subtitle='NO.21-22獎 現金$20,000元，共2位'
        totalWinners={2}
        apiEndpoint='/employee/get-employees-by-group-three'
        prizeName='第三階段 NO.21-22獎 現金$20,000元'
      />
    ),
  },
  {
    path: "/phase-3-5",
    element: (
      <LotteryPage
        title='★ 第三階段摸彩 ★'
        subtitle='NO.23-24獎 現金$30,000元，共2位'
        totalWinners={2}
        apiEndpoint='/employee/get-employees-by-group-three'
        prizeName='第三階段 NO.23-24獎 現金$30,000元'
      />
    ),
  },
]

// 加碼階段路由
const bonusRoutes = [
  {
    path: "/bonus-1-1",
    element: (
      <LotteryPage
        title='★ 加碼階段摸彩 ★'
        subtitle='NO.1-10獎 現金$5,000元，共10位'
        totalWinners={10}
        apiEndpoint='/employee/get-employees-by-all-groups'
        prizeName='加碼階段 NO.1-10獎 現金$5,000元'
      />
    ),
  },
  {
    path: "/bonus-1-2",
    element: (
      <LotteryPage
        title='★ 加碼階段摸彩 ★'
        subtitle='現金$?元，共?位'
        totalWinners={5}
        apiEndpoint='/employee/get-employees-by-all-groups'
        prizeName='加碼階段 現金$?元'
      />
    ),
  },
]

// 合併所有路由
export const router = [
  ...phaseOneRoutes,
  ...phaseTwoRoutes,
  ...phaseThreeRoutes,
  ...bonusRoutes,
  {
    path: "/",
    element: <div>Home Page</div>,
  },
]

export default createHashRouter(router)
