import { useState, useRef } from "react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"

const SlotMachine = () => {
  // 獎品配置
  const prizes = [
    { id: 1, name: "特等獎", image: "🏆" },
    { id: 2, name: "一等獎", image: "💰" },
    { id: 3, name: "二等獎", image: "🎁" },
    { id: 4, name: "三等獎", image: "🎫" },
    { id: 5, name: "四等獎", image: "🎭" },
    { id: 6, name: "五等獎", image: "🎪" },
    { id: 7, name: "六等獎", image: "🎯" },
    { id: 8, name: "七等獎", image: "🎨" },
    { id: 9, name: "八等獎", image: "🎮" },
  ]

  // 模擬員工資料
  const employees = [
    { id: 0, dept: "資訊部", empNo: "RD001", name: "王小明" },
    { id: 1, dept: "資訊部", empNo: "RD002", name: "李小華" },
    { id: 2, dept: "業務部", empNo: "SA001", name: "張小美" },
    { id: 3, dept: "業務部", empNo: "SA002", name: "陳小強" },
    { id: 4, dept: "財務部", empNo: "FN001", name: "林小芳" },
    { id: 5, dept: "財務部", empNo: "FN002", name: "吳小安" },
    { id: 6, dept: "人事部", empNo: "HR001", name: "黃小傑" },
    { id: 7, dept: "人事部", empNo: "HR002", name: "周小萍" },
  ]

  // 為了滾動效果，我們需要重複獎品列表幾次
  const generateReels = () => {
    // 重複獎品列表3次以確保有足夠的項目進行滾動
    return Array(3).fill(prizes).flat()
  }

  const [luckyMode, setLuckyMode] = useState(true) // 預設開啟幸運模式
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const reelsRef = useRef<(HTMLDivElement | null)[]>([])
  const [reelItems] = useState(generateReels())

  // 啟動老虎機
  const startSpin = () => {
    if (spinning) return

    setSpinning(true)
    setShowResult(false)
    // setDonationComplete(false)

    // 修改 startSpin 函數中生成結果的部分
    // 將這段代碼：
    // 增加中獎機率的結果生成
    let newResult: number[] = []
    // 80%的機率會中獎
    if (luckyMode && Math.random() < 0.9) {
      // 隨機選擇一個獎品索引作為中獎結果
      const winningIndex = Math.floor(Math.random() * prizes.length)
      // 所有輪子都顯示相同的獎品
      newResult = [winningIndex, winningIndex, winningIndex]
    } else {
      // 一般模式或剩餘10%機率為隨機結果
      newResult = Array(3)
        .fill(0)
        .map(() => Math.floor(Math.random() * prizes.length))
    }
    setResult(newResult)

    // 為每個輪子設置不同的停止時間
    const spinDurations = [4000, 4500, 5000] // 第一個輪子先停，然後是第二個，最後是第三個

    // 開始滾動每個輪子
    reelsRef.current.forEach((reel, index) => {
      if (!reel) return

      // 重置輪子位置
      reel.style.transition = "none"
      reel.style.transform = "translateY(0)"

      // 強制重繪
      void reel.offsetHeight

      // 計算最終位置
      // 每個項目高度為80px，我們需要滾動到特定位置使結果顯示在中間
      const finalPosition = -(newResult[index] * 80 + 1000) // 額外的1000確保有足夠的滾動距離

      // 設置動畫
      reel.style.transition = `transform ${spinDurations[index]}ms cubic-bezier(0.1, 0.7, 0.1, 1)`
      reel.style.transform = `translateY(${finalPosition}px)`
    })

    // 設定最後一個輪子停止後的回調
    setTimeout(() => {
      setSpinning(false)
      setShowResult(true)

      // 如果三個數字相同，觸發彩花效果
      if (newResult[0] === newResult[1] && newResult[1] === newResult[2]) {
        triggerConfetti()
      }
    }, Math.max(...spinDurations) + 100)
  }

  // 觸發彩花效果
  const triggerConfetti = () => {
    if (typeof window !== "undefined") {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
      })
    }
  }

  return (
    <div className='flex flex-col items-center'>
      {/* <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">試試您的運氣！</h2>
        <p className="text-white">三個相同圖案獲得大獎！</p>
      </div> */}

      {/* 老虎機顯示區 */}
      <div className='relative w-full max-w-md bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg border-2 border-yellow-500 mb-8'>
        {/* 老虎機窗口 */}
        <div className='flex justify-center gap-4 mb-4'>
          {[0, 1, 2].map((_, reelIndex) => (
            <div
              key={reelIndex}
              className='relative w-20 h-20 bg-white rounded-lg overflow-hidden border-4 border-yellow-600 shadow-inner'>
              {/* 輪子容器 */}
              <div
                ref={(el) => (reelsRef.current[reelIndex] = el)}
                className='absolute left-0 w-full'
                style={{
                  transition: "transform 0ms ease",
                }}>
                {/* 重複的獎品項目 */}
                {reelItems.map((prize, itemIndex) => (
                  <div
                    key={`${reelIndex}-${itemIndex}`}
                    className='flex items-center justify-center h-20 w-20 text-4xl'>
                    {prize.image}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 拉桿 */}
        {/* <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-32">
          <div className="w-4 h-full bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-full mx-auto"></div>
          <div
            className={`w-8 h-8 bg-red-600 rounded-full absolute -top-4 left-1/2 -translate-x-1/2 border-2 border-yellow-400 cursor-pointer ${spinning ? "opacity-50" : "animate-pulse"}`}
            onClick={spinning ? undefined : startSpin}
          ></div>
        </div> */}
      </div>

      {/* 結果顯示 */}

      {/* 控制按鈕 */}
      <div className='flex flex-col items-center gap-4'>
        <Button
          size='lg'
          className={`bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-6 text-xl rounded-full shadow-lg border-2 border-yellow-300 ${
            spinning ? "opacity-50 cursor-not-allowed" : "animate-pulse"
          }`}
          onClick={startSpin}
          disabled={spinning}>
          {spinning ? "抽獎中..." : "開始抽獎"}
        </Button>

        {/* <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${luckyMode ? "bg-green-500" : "bg-gray-400"}`}></div>
          <span className="text-yellow-200 text-sm">幸運模式: {luckyMode ? "開啟" : "關閉"}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-400 text-yellow-300 hover:bg-yellow-900/30"
            onClick={() => setLuckyMode(!luckyMode)}
            disabled={spinning}
          >
            {luckyMode ? "關閉" : "開啟"}
          </Button>
        </div> */}
      </div>
    </div>
  )
}

export default SlotMachine
