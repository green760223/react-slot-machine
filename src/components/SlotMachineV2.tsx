import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import "./SlotMachineV2.css"
import EmployeesData from "../data/EmployeesData"

export default function SlotMachineV2() {
  const TOTAL_WINNERS = 5 // 總共抽出5位中獎者
  const [isSpinning, setIsSpinning] = useState(false)
  const [deptSpinning, setDeptSpinning] = useState(false)
  const [empNoSpinning, setEmpNoSpinning] = useState(false)
  const [nameSpinning, setNameSpinning] = useState(false)
  const [currentWinner, setCurrentWinner] = useState<
    (typeof EmployeesData)[0] | null
  >(null)
  const [winners, setWinners] = useState<(typeof EmployeesData)[0][]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedWinnerIndex, setSelectedWinnerIndex] = useState(0)
  const [currentDrawCount, setCurrentDrawCount] = useState(0)
  const [showWinnersList, setShowWinnersList] = useState(false)
  const [redrawMode, setRedrawMode] = useState(false)
  const [redrawingIndex, setRedrawingIndex] = useState<number | null>(null)

  const spinSoundRef = useRef<HTMLAudioElement | null>(null)
  const winSoundRef = useRef<HTMLAudioElement | null>(null)
  const reelRefs = useRef<(HTMLDivElement | null)[]>([])
  const deptPositionRef = useRef(0)
  const empNoPositionRef = useRef(0)
  const namePositionRef = useRef(0)
  const usedIndices = useRef<Set<number>>(new Set())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isSpinning) {
        if (redrawMode) {
          // 在重抽模式下，Enter 鍵不執行任何操作
          return
        } else if (winners.length < TOTAL_WINNERS) {
          spin()
        } else if (!showWinnersList) {
          setShowWinnersList(true)
        } else {
          // 重置抽獎
          setWinners([])
          setCurrentDrawCount(0)
          setShowWinnersList(false)
          usedIndices.current.clear()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSpinning, winners, showWinnersList, redrawMode])

  const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    try {
      if (soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {
          setSoundEnabled(false)
        })
      }
    } catch (error) {
      console.error("Error playing sound:", error)
      setSoundEnabled(false)
    }
  }

  const spin = (isRedraw = false, redrawIndex?: number) => {
    if (isSpinning || (winners.length >= TOTAL_WINNERS && !isRedraw)) return

    setIsSpinning(true)
    setDeptSpinning(true)
    setEmpNoSpinning(true)
    setNameSpinning(true)
    setCurrentWinner(null)
    playSound(spinSoundRef)

    // 從未中獎的員工中隨機選擇獲獎者
    let winnerIndex: number
    do {
      winnerIndex = Math.floor(Math.random() * EmployeesData.length)
    } while (usedIndices.current.has(winnerIndex))

    // 記錄已使用的索引
    usedIndices.current.add(winnerIndex)

    setSelectedWinnerIndex(winnerIndex)
    const winner = EmployeesData[winnerIndex]

    const totalItems = EmployeesData.length
    const deptSpins = Math.floor(Math.random() * 20) + 20
    const empNoSpins = Math.floor(Math.random() * 20) + 20
    const nameSpins = Math.floor(Math.random() * 20) + 20

    deptPositionRef.current =
      (deptSpins * totalItems + winnerIndex) % totalItems
    empNoPositionRef.current =
      (empNoSpins * totalItems + winnerIndex) % totalItems
    namePositionRef.current =
      (nameSpins * totalItems + winnerIndex) % totalItems

    setTimeout(() => {
      setDeptSpinning(false)
    }, 1000)

    setTimeout(() => {
      setEmpNoSpinning(false)
    }, 2000)

    setTimeout(() => {
      setNameSpinning(false)
      setIsSpinning(false)
      setCurrentWinner(winner)

      // 添加到中獎者列表或替換棄權者
      if (isRedraw && redrawIndex !== undefined) {
        setWinners((prev) => {
          const newWinners = [...prev]
          newWinners[redrawIndex] = winner
          return newWinners
        })
        setRedrawMode(false)
        setRedrawingIndex(null)

        // 重抽完成後顯示中獎者清單
        setTimeout(() => {
          setShowWinnersList(true)
        }, 500)
      } else {
        setWinners((prev) => [...prev, winner])
        setCurrentDrawCount((prev) => prev + 1)

        // 如果已經抽完5位，顯示中獎者列表
        if (currentDrawCount + 1 >= TOTAL_WINNERS) {
          setTimeout(() => {
            setShowWinnersList(true)
          }, 1500)
        }
      }

      playSound(winSoundRef)
    }, 3000)
  }

  const handleRedraw = (index: number) => {
    // 移除該中獎者的索引，允許重新抽取
    const winnerToRemove = winners[index]
    const indexToRemove = EmployeesData.findIndex(
      (emp) =>
        emp.dept === winnerToRemove.dept &&
        emp.empNo === winnerToRemove.empNo &&
        emp.name === winnerToRemove.name
    )

    if (indexToRemove !== -1) {
      usedIndices.current.delete(indexToRemove)
    }

    setRedrawMode(true)
    setRedrawingIndex(index)
    setShowWinnersList(false)

    // 延遲一下再開始重抽，讓用戶看到界面變化
    setTimeout(() => {
      spin(true, index)
    }, 500)
  }

  // 新增：處理部門名稱斷行的函數
  const formatDept = (dept: string) => {
    const keywords = ["點點心", "忠青商行", "炒湘湘"]
    for (const keyword of keywords) {
      if (dept.includes(keyword)) {
        return dept.replace(keyword, `${keyword}\n`)
      }
    }
    return dept
  }

  return (
    <div className='relative min-h-screen w-full'>
      {/* 背景圖片容器 */}
      <div
        className='absolute inset-0 w-full h-full'
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover", // 填滿畫面
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}></div>

      {/* 添加文字 - 頂部 */}
      <div className='fixed top-0 left-0 w-full flex flex-col items-center pt-170'>
        <div className='text-[100px] font-bold text-white tracking-widest'>
          ★第一階段摸彩★
        </div>
        <div className='text-[100px] tracking-widest text-white font-bold'>
          NO.1-10獎 現金$3,000元，共10位
        </div>
      </div>

      {/* 老虎機容器 - 精確對齊白色方框 */}
      <div
        className={`absolute top-[45%] left-1/2 -translate-x-1/2 w-full max-w-[2600px] pt-50 ${
          showWinnersList ? "opacity-0" : "opacity-100"
        }`}>
        <div className='flex items-center justify-center pr-40 min-h-[500px]'>
          {/* 抽獎區域 */}
          <div className='relative w-full'>
            {/* 抽獎顯示區 */}
            <div className='grid grid-cols-3 gap-4 px-4 w-full'>
              {/* 部門欄位 */}
              <div className='relative h-56 overflow-hidden'>
                <div
                  ref={(el) => (reelRefs.current[0] = el)}
                  className={`slot-reel absolute inset-0 ${
                    deptSpinning ? "spinning" : ""
                  }`}
                  style={
                    !deptSpinning
                      ? {
                          transform: `translateY(-${
                            selectedWinnerIndex * 100
                          }%)`,
                        }
                      : {}
                  }>
                  {[...Array(EmployeesData.length)].map((_, index) => {
                    const employee = EmployeesData[index % EmployeesData.length]
                    return (
                      <div
                        key={index}
                        className='absolute w-full h-56 flex items-center justify-center'
                        style={{ top: `${index * 100}%` }}>
                        <div
                          className='text-7xl font-extrabold text-black tracking-widest leading-relaxed'
                          style={{
                            whiteSpace: "pre-wrap",
                            textAlign: "center",
                          }}>
                          {formatDept(employee.dept)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 員工編號欄位 */}
              <div className='relative h-56 overflow-hidden'>
                <div
                  ref={(el) => (reelRefs.current[1] = el)}
                  className={`slot-reel absolute inset-0 ${
                    empNoSpinning ? "spinning" : ""
                  }`}
                  style={
                    !empNoSpinning
                      ? {
                          transform: `translateY(-${
                            selectedWinnerIndex * 100
                          }%)`,
                        }
                      : {}
                  }>
                  {[...Array(EmployeesData.length)].map((_, index) => {
                    const employee = EmployeesData[index % EmployeesData.length]
                    return (
                      <div
                        key={index}
                        className='absolute w-full h-56 flex items-center justify-center'
                        style={{ top: `${index * 100}%` }}>
                        <div className='text-7xl font-extrabold text-black'>
                          {employee.empNo}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 姓名欄位 */}
              <div className='relative h-56 overflow-hidden'>
                <div
                  ref={(el) => (reelRefs.current[2] = el)}
                  className={`slot-reel absolute inset-0 ${
                    nameSpinning ? "spinning" : ""
                  }`}
                  style={
                    !nameSpinning
                      ? {
                          transform: `translateY(-${
                            selectedWinnerIndex * 100
                          }%)`,
                        }
                      : {}
                  }>
                  {[...Array(EmployeesData.length)].map((_, index) => {
                    const employee = EmployeesData[index % EmployeesData.length]
                    return (
                      <div
                        key={index}
                        className='absolute w-full h-56 flex items-center justify-center'
                        style={{ top: `${index * 100}%` }}>
                        <div className='text-7xl font-extrabold text-black'>
                          {employee.name}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 中獎者列表 */}
      <div
        className={`absolute top-[30%] left-1/2 -translate-x-1/2 w-full max-w-[3500px] px-4 transition-opacity duration-500 ${
          showWinnersList ? "opacity-100" : "opacity-0"
        }`}>
        <div className='bg-white rounded-lg p-10 shadow-lg h-[1300px]'>
          <h2 className='text-8xl font-bold text-center py-20 text-black'>
            恭喜以下中獎者！
          </h2>
          <div className='grid grid-cols-4 gap-4 text-center font-bold text-xl mb-4 border-b-black p-5'>
            <div className='text-5xl'>所屬部門</div>
            <div className='text-5xl'>員工編號</div>
            <div className='text-5xl'>姓名</div>
            <div className='text-5xl'>操作</div>
          </div>
          {winners.map((winner, index) => (
            <div
              key={index}
              className='grid grid-cols-4 gap-4 text-center text-5xl py-8 border-b border-gray-300'>
              <div className='font-bold tracking-widest'>{winner.dept}</div>
              <div className='font-bold tracking-widest'>{winner.empNo}</div>
              <div className='font-bold tracking-widest'>{winner.name}</div>
              <div>
                <Button
                  variant='secondary'
                  className='text-5xl py-4 px-8 h-16 w-48 tracking-widest'
                  onClick={() => handleRedraw(index)}>
                  棄權重抽
                </Button>
              </div>
            </div>
          ))}
          <div className='text-center mt-6 text-lg text-gray-600'>
            {/* 請按 Enter 鍵重新開始抽獎 */}
          </div>
        </div>
      </div>

      {/* 抽獎進度 */}
      <div className='absolute top-[2000px] left-1/2 -translate-x-1/2 w-full text-center'>
        <div className='text-7xl font-extrabold text-white tracking-widest'>
          {redrawMode
            ? "重新抽獎中..."
            : showWinnersList
            ? ""
            : `抽獎進度: ${winners.length}/${TOTAL_WINNERS}`}
        </div>
      </div>

      {/* 隱藏按鈕區域，但保留功能 */}
      <div className='hidden'>
        <Button
          onClick={() => spin()}
          disabled={isSpinning}
          className='w-full h-16 text-lg font-bold'>
          <span>{isSpinning ? "抽獎中..." : "開始抽獎"}</span>
        </Button>

        <Button
          variant='outline'
          size='sm'
          onClick={() => setSoundEnabled(!soundEnabled)}
          className='w-full'>
          音效: {soundEnabled ? "開啟" : "關閉"}
        </Button>
      </div>

      {/* 音效元素 */}
      <audio ref={spinSoundRef} preload='auto'>
        <source src='/placeholder.mp3' type='audio/mpeg' />
      </audio>
      <audio ref={winSoundRef} preload='auto'>
        <source src='/placeholder.mp3' type='audio/mpeg' />
      </audio>
    </div>
  )
}
