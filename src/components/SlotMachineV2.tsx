import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
import "./SlotMachineV2.css"

// 模擬員工資料
const EMPLOYEES = [
  { id: 0, dept: "資訊部", empNo: "RD001", name: "王小明" },
  { id: 1, dept: "資訊部", empNo: "RD002", name: "李小華" },
  { id: 2, dept: "業務部", empNo: "SA001", name: "張小美" },
  { id: 3, dept: "業務部", empNo: "SA002", name: "陳小強" },
  { id: 4, dept: "財務部", empNo: "FN001", name: "林小芳" },
  { id: 5, dept: "財務部", empNo: "FN002", name: "吳小安" },
  { id: 6, dept: "人事部", empNo: "HR001", name: "黃小傑" },
  { id: 7, dept: "人事部", empNo: "HR002", name: "周小萍" },
]

const SlotMachineV2 = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [deptSpinning, setDeptSpinning] = useState(false)
  const [empNoSpinning, setEmpNoSpinning] = useState(false)
  const [nameSpinning, setNameSpinning] = useState(false)
  const [winner, setWinner] = useState<(typeof EMPLOYEES)[0] | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedWinnerIndex, setSelectedWinnerIndex] = useState(0)

  const spinSoundRef = useRef<HTMLAudioElement | null>(null)
  const winSoundRef = useRef<HTMLAudioElement | null>(null)
  const reelRefs = useRef<(HTMLDivElement | null)[]>([])
  const deptPositionRef = useRef(0)
  const empNoPositionRef = useRef(0)
  const namePositionRef = useRef(0)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isSpinning) {
        spin()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSpinning])

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

  const spin = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setDeptSpinning(true)
    setEmpNoSpinning(true)
    setNameSpinning(true)
    setWinner(null)
    playSound(spinSoundRef)

    const winnerIndex = Math.floor(Math.random() * EMPLOYEES.length)
    setSelectedWinnerIndex(winnerIndex)
    const winner = EMPLOYEES[winnerIndex]

    const totalItems = EMPLOYEES.length
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
      setWinner(winner)
      playSound(winSoundRef)
    }, 3000)
  }

  return (
    <div>
      <div className='relative min-h-screen w-full'>
        {/* 背景圖片容器 */}
        <div className='absolute inset-0 w-full h-full'>
          <img
            src='/background.png'
            alt='Dimerco award ceremony background'
            className='object-cover w-full h-full'
          />
        </div>

        {/* 添加文字 - 頂部 */}
        <div className='absolute top-[120px] left-1/2 -translate-x-1/2 w-full text-center'>
          <div className='text-xl font-bold text-yellow-300 mb-1'>
            【貴賓獎】現金$20,000元 共五位
          </div>
          <div className='text-lg text-yellow-300'>
            感謝 中菲行國際物流集團創辦人 錢堯懷先生 贊助
          </div>
        </div>

        {/* 添加文字 - 紅毯區域 */}
        <div className='absolute bottom-[100px] left-1/2 -translate-x-1/2 w-full text-center'>
          <div className='text-2xl font-bold text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'>
            抽獎組別：A/B/C
          </div>
        </div>

        {/* 老虎機容器 - 調整位置到白色框框內 */}
        <div className='absolute top-[45%] left-1/2 -translate-x-1/2 w-full max-w-4xl px-4'>
          <div className='p-0'>
            {/* 抽獎區域 */}
            <div className='relative'>
              {/* 抽獎顯示區 */}
              <div className='grid grid-cols-3 gap-4 p-4 rounded-lg'>
                {/* 部門欄位 */}
                <div className='relative h-32 rounded-lg overflow-hidden backdrop-blur-sm bg-black/10'>
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
                    {[...Array(20)].map((_, index) => {
                      const employee = EMPLOYEES[index % EMPLOYEES.length]
                      return (
                        <div
                          key={index}
                          className='absolute w-full h-32 flex items-center justify-center'
                          style={{ top: `${index * 100}%` }}>
                          <div className='text-2xl font-bold text-yellow-300'>
                            {employee.dept}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 員工編號欄位 */}
                <div className='relative h-32 rounded-lg overflow-hidden backdrop-blur-sm bg-black/10'>
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
                    {[...Array(20)].map((_, index) => {
                      const employee = EMPLOYEES[index % EMPLOYEES.length]
                      return (
                        <div
                          key={index}
                          className='absolute w-full h-32 flex items-center justify-center'
                          style={{ top: `${index * 100}%` }}>
                          <div className='text-2xl font-bold text-white'>
                            {employee.empNo}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 姓名欄位 */}
                <div className='relative h-32 rounded-lg overflow-hidden backdrop-blur-sm bg-black/10'>
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
                    {[...Array(20)].map((_, index) => {
                      const employee = EMPLOYEES[index % EMPLOYEES.length]
                      return (
                        <div
                          key={index}
                          className='absolute w-full h-32 flex items-center justify-center'
                          style={{ top: `${index * 100}%` }}>
                          <div className='text-2xl font-bold text-yellow-300'>
                            {employee.name}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 顯示最終結果 - 已移除可見性 */}
              {!isSpinning && winner && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg opacity-0'>
                  <div className='grid grid-cols-3 gap-4 px-4 w-full'>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-yellow-300'>
                        {winner.dept}
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-white'>
                        {winner.empNo}
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-yellow-300'>
                        {winner.name}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 隱藏按鈕區域，但保留功能 */}
            <div className='hidden'>
              <Button
                onClick={spin}
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
          </div>
        </div>

        {/* 音效元素 */}
        <audio ref={spinSoundRef} preload='auto'>
          {/* <source src='/sound.mp3' type='audio/mpeg' /> */}
        </audio>
        <audio ref={winSoundRef} preload='auto'>
          {/* <source src='/placeholder.mp3' type='audio/mpeg' /> */}
        </audio>
      </div>
    </div>
  )
}

export default SlotMachineV2
