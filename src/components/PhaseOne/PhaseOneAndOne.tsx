import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import "./PhaseOneAndOne.css"
// import EmployeesData from "../data/EmployeesData"
import api from "@/api"
import { Employee } from "@/types/api"

export default function PhaseOneAndOne() {
  const TOTAL_WINNERS = 10
  const [isSpinning, setIsSpinning] = useState(false)
  const [deptSpinning, setDeptSpinning] = useState(false)
  const [empNoSpinning, setEmpNoSpinning] = useState(false)
  const [nameSpinning, setNameSpinning] = useState(false)
  const [employeesData, setEmployeesData] = useState<Employee.Info[]>([])
  // const [currentWinner, setCurrentWinner] = useState<
  //   (typeof EmployeesData)[0] | null
  //   >(null)
  const [currentWinner, setCurrentWinner] = useState<Employee.Info | null>(null)
  // const [winners, setWinners] = useState<(typeof EmployeesData)[0][]>([])
  const [winners, setWinners] = useState<Employee.Info[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedWinnerIndex, setSelectedWinnerIndex] = useState(0)
  const [currentDrawCount, setCurrentDrawCount] = useState(0)
  const [showWinnersList, setShowWinnersList] = useState(false)
  const [redrawMode, setRedrawMode] = useState(false)
  const [redrawingIndex, setRedrawingIndex] = useState<number | null>(null)

  const spinSoundRef = useRef<HTMLAudioElement | null>(null)
  const winSoundRef = useRef<HTMLAudioElement | null>(null)
  const reelRefs = useRef<(HTMLDivElement | null)[]>([])
  const usedIndices = useRef<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getEmployeesByGroupOne()
  }, [])

  useEffect(() => {
    if (winners.length > 0) {
      console.log("Current winners list:", winners)
    }
  }, [winners])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isSpinning) {
        if (redrawMode) return
        else if (winners.length < TOTAL_WINNERS) spin()
        else if (!showWinnersList) setShowWinnersList(true)
        else {
          setWinners([])
          setCurrentDrawCount(0)
          setShowWinnersList(false)
          usedIndices.current.clear()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSpinning, winners, showWinnersList, redrawMode])

  // Fetch employees data by group one from the API
  const getEmployeesByGroupOne = async () => {
    try {
      setIsLoading(true)
      const res: Employee.Info[] = await api.getEmployeeByGroupOne()
      console.log("Raw API response:", res) // 調試：檢查 API 返回的數據
      if (res && Array.isArray(res) && res.length > 0) {
        setEmployeesData(res)
      } else {
        console.warn("Invalid or empty data returned from API")
        setEmployeesData([]) // 設置空陣列以避免後續錯誤
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      setEmployeesData([]) // 錯誤時設置空陣列
    } finally {
      setIsLoading(false)
    }
  }

  // const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
  //   try {
  //     if (soundEnabled && audioRef.current) {
  //       audioRef.current.currentTime = 0
  //       audioRef.current.play().catch(() => setSoundEnabled(false))
  //     }
  //   } catch (error) {
  //     console.error("Error playing sound:", error)
  //     setSoundEnabled(false)
  //   }
  // }

  const spin = (isRedraw = false, redrawIndex?: number) => {
    if (isSpinning || (winners.length >= TOTAL_WINNERS && !isRedraw)) return

    setIsSpinning(true)
    setDeptSpinning(true)
    setEmpNoSpinning(true)
    setNameSpinning(true)
    setCurrentWinner(null)
    // playSound(spinSoundRef)

    let winnerIndex: number
    do {
      // winnerIndex = Math.floor(Math.random() * EmployeesData.length)
      winnerIndex = Math.floor(Math.random() * employeesData.length)
    } while (usedIndices.current.has(winnerIndex))

    usedIndices.current.add(winnerIndex)
    setSelectedWinnerIndex(winnerIndex)
    // const winner = EmployeesData[winnerIndex]
    const winner = employeesData[winnerIndex]
    console.log("Selected winner:", winner)

    // const totalItems = EmployeesData.length
    const totalItems = employeesData.length
    const deptSpins = Math.floor(Math.random() * 20) + 20
    const empNoSpins = Math.floor(Math.random() * 20) + 20
    const nameSpins = Math.floor(Math.random() * 20) + 20

    reelRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.style.transition = "transform 3s ease-out"
        ref.style.transform = `translateY(-${
          (i === 0 ? deptSpins : i === 1 ? empNoSpins : nameSpins) *
            totalItems +
          winnerIndex
        }%)`
      }
    })

    setTimeout(() => setDeptSpinning(false), 1000)
    setTimeout(() => setEmpNoSpinning(false), 2000)
    setTimeout(() => {
      setNameSpinning(false)
      setIsSpinning(false)
      setCurrentWinner(winner)

      if (isRedraw && redrawIndex !== undefined) {
        setWinners((prev) => {
          const newWinners = [...prev]
          newWinners[redrawIndex] = winner
          return newWinners
        })
        setRedrawMode(false)
        setRedrawingIndex(null)
        setTimeout(() => setShowWinnersList(true), 500)
      } else {
        setWinners((prev) => [...prev, winner])
        setCurrentDrawCount((prev) => prev + 1)
        if (currentDrawCount + 1 >= TOTAL_WINNERS) {
          setTimeout(() => setShowWinnersList(true), 1500)
        }
      }
      // playSound(winSoundRef)
    }, 3000)
  }

  // 棄權重抽
  const handleRedraw = (index: number) => {
    const winnerToRemove = winners[index]
    // const indexToRemove = EmployeesData.findIndex(
    //   (emp) =>
    //     emp.dept === winnerToRemove.dept &&
    //     emp.empNo === winnerToRemove.empNo &&
    //     emp.name === winnerToRemove.name
    // )
    const indexToRemove = employeesData.findIndex(
      (emp) =>
        emp.department === winnerToRemove.department &&
        emp.employee_id === winnerToRemove.employee_id &&
        emp.name === winnerToRemove.name
    )
    if (indexToRemove !== -1) usedIndices.current.delete(indexToRemove)
    else
      console.log(
        "Winner not found in employeesData for redraw:",
        winnerToRemove
      ) // 調試

    setRedrawMode(true)
    setRedrawingIndex(index)
    setShowWinnersList(false)
    setTimeout(() => spin(true, index), 1000)
  }

  // 格式化部門名稱 - 換行
  const formatDept = (dept: string) => {
    const keywords = ["點點心", "忠青商行", "炒湘湘"]
    for (const keyword of keywords) {
      if (dept.includes(keyword)) return dept.replace(keyword, `${keyword}\n`)
    }
    return dept
  }

  return (
    <div className='relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black'>
      {/* 底圖容器，保持 16:9 比例 */}
      <div
        className='relative w-full h-full max-w-[1920px] max-h-[1080px]'
        style={{
          aspectRatio: "16 / 9",
          backgroundImage: "url('/background_16x9_new.png')",
          backgroundSize: "contain", // 確保底圖完整顯示
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        {/* 頂部文字 */}
        <div className='absolute top-[30%] left-0 w-full flex flex-col items-center'>
          <div className='text-5xl font-bold text-white tracking-widest pt-5'>
            ★ 第一階段摸彩 ★
          </div>
          <div className='text-5xl tracking-widest text-white font-bold pt-5'>
            NO.1-10獎 現金$3,000元，共10位
          </div>
        </div>

        {/* 老虎機容器 - 精確對齊白色方框 */}
        <div
          className={`absolute top-[35%] left-1/2 -translate-x-1/2 w-full max-w-[1100px] pt-12 ${
            showWinnersList ? "opacity-0" : "opacity-100"
          }`}>
          <div className='flex items-center justify-center min-h-[500px] pr-24'>
            {/* 抽獎區域
          <div className='relative w-full'>
            {/* 抽獎顯示區 */}
            <div className='grid grid-cols-3 gap-4 w-full'>
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
                  {[...Array(employeesData.length)].map((_, index) => {
                    const employee = employeesData[index % employeesData.length]
                    return (
                      <div
                        key={index}
                        className='absolute w-full h-56 flex items-center justify-center'
                        style={{ top: `${index * 100}%` }}>
                        <div
                          className='text-4xl font-extrabold text-black tracking-widest leading-relaxed'
                          style={{
                            whiteSpace: "pre-wrap",
                            textAlign: "center",
                          }}>
                          {formatDept(employee.department)}
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
                  {[...Array(employeesData.length)].map((_, index) => {
                    const employee = employeesData[index % employeesData.length]
                    return (
                      <div
                        key={index}
                        className='absolute w-full h-56 flex items-center justify-center'
                        style={{ top: `${index * 100}%` }}>
                        <div className='text-4xl font-extrabold text-black pl-4'>
                          {employee.employee_id}
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
                  {[...Array(employeesData.length)].map((_, index) => {
                    const employee = employeesData[index % employeesData.length]
                    return (
                      <div
                        key={index}
                        className='absolute w-full h-56 flex items-center justify-center'
                        style={{ top: `${index * 100}%` }}>
                        <div className='text-4xl font-extrabold text-black'>
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

        {/* 中獎者列表 */}
        <div
          className={`absolute top-[12%] left-1/2 -translate-x-1/2 w-full max-w-[1400px] px-4 transition-opacity duration-500 ${
            showWinnersList ? "opacity-100" : "opacity-0"
          }`}>
          <div className='bg-white rounded-lg p-4 shadow-lg max-h-[1000px] overflow-y-auto'>
            {/* 標題 */}
            <h2 className='text-3xl font-bold text-center py-5 text-black'>
              第一階段 NO.1-10獎 現金$3,000元
            </h2>
            {/* 表頭 */}
            <div className='grid grid-cols-4 gap-4 text-center font-bold text-lg mb-4 border-b border-black p-4'>
              <div className='text-2xl'>所屬部門</div>
              <div className='text-2xl'>員工編號</div>
              <div className='text-2xl'>姓名</div>
            </div>
            {/* 中獎清單 */}
            <div
              style={{
                minHeight:
                  winners.length > 0 ? `${winners.length * 50 + 100}px` : "0px", // 動態計算最小高度
              }}>
              {winners.map((winner, index) => (
                <div
                  key={index}
                  className='grid grid-cols-4 gap-4 text-center text-xl py-1 border-b border-gray-300 justify-center items-center'>
                  <div className='font-bold tracking-widest'>
                    {/* {winner.department} */}
                  </div>
                  <div className='font-bold tracking-widest'>
                    {/* {winner.employee_id} */}
                  </div>
                  <div className='font-bold tracking-widest'>
                    {/* {winner.name} */}
                  </div>
                  <div>
                    <Button
                      variant='link'
                      onClick={() => handleRedraw(index)}
                      title='棄權重抽'>
                      <img
                        src='/weido_logo.png'
                        alt='棄權重抽'
                        className='h-14 w-14'
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 抽獎進度 */}
        <div className='absolute bottom-35 left-1/2 -translate-x-1/2 w-full text-center'>
          <div className='text-3xl font-extrabold text-white tracking-widest'>
            {redrawMode
              ? "重新抽獎中..."
              : showWinnersList
              ? ""
              : `抽獎進度: ${winners.length}/${TOTAL_WINNERS}`}
          </div>
        </div>
      </div>
    </div>
  )
}
