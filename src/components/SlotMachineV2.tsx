import { useState, useRef, useEffect } from "react"
import EmployeesData from "../data/EmployeesData"
import "./SlotMachineV2.css"

const SlotMachineV2 = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [deptSpinning, setDeptSpinning] = useState(false)
  const [empNoSpinning, setEmpNoSpinning] = useState(false)
  const [nameSpinning, setNameSpinning] = useState(false)
  const [winner, setWinner] = useState<(typeof EmployeesData)[0] | null>(null)
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

    const winnerIndex = Math.floor(Math.random() * EmployeesData.length)
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
    }, 2000)

    setTimeout(() => {
      setEmpNoSpinning(false)
    }, 3000)

    setTimeout(() => {
      setNameSpinning(false)
      setIsSpinning(false)
      setWinner(winner)
      playSound(winSoundRef)
    }, 4000)
  }

  return (
    <div>
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
        {/* <div className='absolute top-[120px] left-1/2 -translate-x-1/2 w-full text-center'>
          <div className='text-5xl font-bold text-white pt-20'>
            【貴賓獎】現金$20,000元 共五位
          </div>
          <div className='text-lg text-yellow-300'>
            感謝 中菲行國際物流集團創辦人 錢堯懷先生 贊助
          </div>
        </div> */}
        <div className='fixed top-0 left-0 w-full flex flex-col items-center pt-170'>
          <div className='text-[100px] font-bold text-white tracking-widest'>
            ★第一階段摸彩★
          </div>
          <div className='text-[100px] tracking-widest text-white font-bold'>
            NO.1-10獎 現金$3,000元，共10位
          </div>
        </div>

        {/* 老虎機容器 - 精確對齊白色方框 */}
        <div className='absolute top-[40%] left-1/2 -translate-x-1/2 w-full max-w-[2000px]'>
          <div className='flex items-center justify-center h-[350px] pr-20'>
            {/* 抽獎區域 */}
            <div className='relative w-full'>
              {/* 抽獎顯示區 */}
              <div className='grid grid-cols-3 gap-8 px-8'>
                {/* 部門欄位 */}
                <div className='relative h-36 overflow-hidden'>
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
                      const employee =
                        EmployeesData[index % EmployeesData.length]
                      return (
                        <div
                          key={index}
                          className='absolute w-full h-36 flex items-center justify-center'
                          style={{ top: `${index * 100}%` }}>
                          <div className='text-7xl font-extrabold text-black tracking-widest'>
                            {employee.dept}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 員工編號欄位 */}
                <div className='relative h-36 overflow-hidden'>
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
                      const employee =
                        EmployeesData[index % EmployeesData.length]
                      return (
                        <div
                          key={index}
                          className='absolute w-full h-36 flex items-center justify-center'
                          style={{ top: `${index * 100}%` }}>
                          <div className='text-7xl font-extrabold text-black tracking-widest'>
                            {employee.empNo}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 姓名欄位 */}
                <div className='relative h-36 overflow-hidden'>
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
                      const employee =
                        EmployeesData[index % EmployeesData.length]
                      return (
                        <div
                          key={index}
                          className='absolute w-full h-36 flex items-center justify-center'
                          style={{ top: `${index * 100}%` }}>
                          <div className='text-7xl font-extrabold text-black tracking-widest'>
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
                      <div className='text-4xl font-extrabold text-black'>
                        {winner.dept}
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-4xl font-extrabold text-black'>
                        {winner.empNo}
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-4xl font-extrabold text-black'>
                        {winner.name}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 添加文字 - 紅毯區域 */}
        <div className='fixed bottom-0 left-0 w-full flex justify-center items-end pb-50'>
          <div className='text-6xl font-bold text-white tracking-widest'>
            {/* 抽獎組別：A/B/C */}
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
