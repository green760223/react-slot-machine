import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import "../PhaseOne/PhaseOne.css"
import api from "@/api"
import { Employee } from "@/types/api"
import confetti from "canvas-confetti"

interface LotteryPageProps {
  title?: string
  subtitle?: string
  totalWinners?: number
  apiEndpoint?: string
  prizeName?: string
}

export default function LotteryPage({
  title = "★ 第一階段摸彩 ★",
  subtitle = "NO.11-20獎 現金$5,000元，共10位",
  totalWinners = 10,
  apiEndpoint = "/employee/get-employees-by-group-one",
  prizeName = "第一階段獎金5000元",
}: LotteryPageProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [deptSpinning, setDeptSpinning] = useState(false)
  const [empNoSpinning, setEmpNoSpinning] = useState(false)
  const [nameSpinning, setNameSpinning] = useState(false)
  const [employeesData, setEmployeesData] = useState<Employee.Info[]>([])
  const [availableEmployees, setAvailableEmployees] = useState<Employee.Info[]>(
    []
  )
  const [_currentWinner, setCurrentWinner] = useState<Employee.Info | null>(
    null
  )
  const [winners, setWinners] = useState<Employee.Info[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedWinnerIndex, setSelectedWinnerIndex] = useState(0)
  const [currentDrawCount, setCurrentDrawCount] = useState(0)
  const [showWinnersList, setShowWinnersList] = useState(false)
  const [redrawMode, setRedrawMode] = useState(false)
  const [_redrawingIndex, setRedrawingIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [allWinnersHistory, setAllWinnersHistory] = useState<Employee.Info[]>(
    []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const spinSoundRef = useRef<HTMLAudioElement | null>(null)
  const winSoundRef = useRef<HTMLAudioElement | null>(null)
  const reelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (winners.length > 0) {
      console.log("Current winners list:", winners)
      console.log("All winners history:", allWinnersHistory)
    }
  }, [winners])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        !isSpinning &&
        !isLoading &&
        availableEmployees.length > 0
      ) {
        if (redrawMode) return
        else if (winners.length < totalWinners) {
          if (winners.length === 0) setHasStarted(true)
          spin()
        } else if (!showWinnersList) {
          setShowWinnersList(true)
        } else {
          resetLottery()
        }
      } else if (isLoading || availableEmployees.length === 0) {
        console.warn(
          "Data is still loading or no available employees, cannot spin yet."
        )
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    isSpinning,
    winners,
    showWinnersList,
    redrawMode,
    isLoading,
    availableEmployees,
    totalWinners,
  ])

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const res: Employee.Info[] = await api.getByEndpoint(apiEndpoint)
      console.log("Raw API response:", res)
      if (res && Array.isArray(res) && res.length > 0) {
        setEmployeesData(res)
        const excludedEmployeeIds = new Set(
          allWinnersHistory
            .filter((emp) => emp.is_donated)
            .map((emp) => emp.employee_id)
        )
        setAvailableEmployees(
          res.filter(
            (emp) => !emp.is_won && !excludedEmployeeIds.has(emp.employee_id)
          )
        )
      } else {
        console.warn("Invalid or empty data returned from API")
        setEmployeesData([])
        setAvailableEmployees([])
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      setEmployeesData([])
      setAvailableEmployees([])
    } finally {
      setIsLoading(false)
    }
  }

  const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    try {
      if (soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => setSoundEnabled(false))
      }
    } catch (error) {
      console.error("Error playing sound:", error)
      setSoundEnabled(false)
    }
  }

  const spin = (isRedraw = false, redrawIndex?: number) => {
    if (
      isSpinning ||
      (winners.length >= totalWinners && !isRedraw) ||
      availableEmployees.length === 0
    ) {
      if (availableEmployees.length === 0) {
        console.warn("No available employees to spin!")
        return
      }
    }

    setIsSpinning(true)
    setDeptSpinning(true)
    setEmpNoSpinning(true)
    setNameSpinning(true)
    setCurrentWinner(null)
    playSound(spinSoundRef)

    const winnerIndex = Math.floor(Math.random() * availableEmployees.length)
    const winner = availableEmployees[winnerIndex]
    if (!winner) {
      console.error("Winner is undefined at index:", winnerIndex)
      setIsSpinning(false)
      return
    }
    console.log("Selected winner:", winner)

    setAvailableEmployees((prev) =>
      prev.filter((_emp, idx) => idx !== winnerIndex)
    )

    const originalIndex = employeesData.findIndex(
      (emp) =>
        emp.department === winner.department &&
        emp.employee_id === winner.employee_id &&
        emp.name === winner.name
    )
    setSelectedWinnerIndex(originalIndex >= 0 ? originalIndex : 0)

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
          originalIndex
        }%)`
      }
    })

    setTimeout(() => setDeptSpinning(false), 1000)
    setTimeout(() => setEmpNoSpinning(false), 2000)
    setTimeout(() => {
      setNameSpinning(false)
      setIsSpinning(false)
      setCurrentWinner(winner)

      setAllWinnersHistory((prev) => {
        if (isRedraw && redrawIndex !== undefined) {
          const updatedHistory = [...prev]
          updatedHistory[redrawIndex] = {
            ...updatedHistory[redrawIndex],
            is_donated: true,
          }
          return [...updatedHistory, { ...winner, isRedrawn: true }]
        } else {
          return [...prev, { ...winner, isRedrawn: false }]
        }
      })

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
        if (currentDrawCount + 1 >= totalWinners) {
          setTimeout(() => setShowWinnersList(true), 1000)
        }
      }
      playSound(winSoundRef)
    }, 3000)
  }

  const handleRedraw = (index: number) => {
    const winnerToRemove = winners[index]
    const indexToRemove = availableEmployees.findIndex(
      (emp) =>
        emp.department === winnerToRemove.department &&
        emp.employee_id === winnerToRemove.employee_id &&
        emp.name === winnerToRemove.name
    )
    if (indexToRemove !== -1) {
      setAvailableEmployees((prev) =>
        prev.filter((_, idx) => idx !== indexToRemove)
      )
    } else {
      console.log(
        "Winner not found in availableEmployees for redraw:",
        winnerToRemove
      )
    }

    setRedrawMode(true)
    setRedrawingIndex(index)
    setShowWinnersList(false)
    setTimeout(() => spin(true, index), 0)
  }

  const resetLottery = () => {
    setWinners([])
    setAllWinnersHistory([])
    setCurrentDrawCount(0)
    setShowWinnersList(false)
    setHasStarted(false)
    setAvailableEmployees([...employeesData])
  }

  const formatWinnersForApi = () => {
    return allWinnersHistory.map((winner) => {
      const originalEmployee = employeesData.find(
        (emp) =>
          emp.department === winner.department &&
          emp.employee_id === winner.employee_id &&
          emp.name === winner.name
      )
      return {
        id: originalEmployee?.id || 0,
        name: winner.name || "未知姓名",
        group: winner.group || "1",
        department: winner.department || "未知部門",
        employee_id: winner.employee_id || "未知編號",
        prize: prizeName,
        is_won: true,
        is_donated: winner.is_donated || false,
      }
    })
  }

  const submitWinners = async () => {
    setIsSubmitting(true)
    try {
      const formattedWinners = formatWinnersForApi()
      const response = await api.addWinners(formattedWinners)
      console.log("API response:", response)
      triggerConfetti()
    } catch (error) {
      console.error("Error submitting winners:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 300 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  const formatDept = (dept: string) => {
    const keywords = ["點點心", "忠青商行", "炒湘湘"]
    for (const keyword of keywords) {
      if (dept.includes(keyword)) return dept.replace(keyword, `${keyword}\n`)
    }
    return dept
  }

  return (
    <div className='relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black'>
      <div
        className='relative w-full h-full max-w-[1920px] max-h-[1080px]'
        style={{
          aspectRatio: "16 / 9",
          backgroundImage: "url('/background_16x9_new.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <div className='absolute top-[30%] left-0 w-full flex flex-col items-center'>
          <div className='text-5xl font-bold text-white tracking-widest pt-5 pr-30'>
            {title}
          </div>
          <div className='text-5xl tracking-widest text-white font-bold pt-5 pr-20'>
            {subtitle}
          </div>
        </div>

        <div
          className={`absolute top-[35%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] pt-18 pr-10 ${
            showWinnersList ? "opacity-0" : "opacity-100"
          }`}>
          {isLoading ? (
            <div className='text-white text-2xl'>Loading...</div>
          ) : employeesData.length === 0 ? (
            <div className='text-white text-2xl'>
              {/* No employees data available. */}
            </div>
          ) : !hasStarted ? (
            <div className='text-white text-2xl'></div>
          ) : (
            <div className='flex items-center justify-center min-h-[500px] pr-15'>
              <div className='grid grid-cols-3 gap-4 w-full'>
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
                      const employee =
                        employeesData[index % employeesData.length]
                      if (!employee) {
                        console.warn(`Employee at index ${index} is undefined`)
                        return null
                      }
                      return (
                        <div
                          key={index}
                          className='absolute w-full h-56 flex items-center justify-center'
                          style={{ top: `${index * 100}%` }}>
                          <div
                            className='text-3xl font-extrabold text-black tracking-widest leading-relaxed'
                            style={{
                              whiteSpace: "pre-wrap",
                              textAlign: "center",
                            }}>
                            {formatDept(employee.department || "未知部門")}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

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
                      const employee =
                        employeesData[index % employeesData.length]
                      if (!employee) {
                        console.warn(`Employee at index ${index} is undefined`)
                        return null
                      }
                      return (
                        <div
                          key={index}
                          className='absolute w-full h-56 flex items-center justify-center'
                          style={{ top: `${index * 100}%` }}>
                          <div className='text-3xl font-extrabold text-black '>
                            {employee.employee_id || "未知編號"}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

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
                      const employee =
                        employeesData[index % employeesData.length]
                      if (!employee) {
                        console.warn(`Employee at index ${index} is undefined`)
                        return null
                      }
                      return (
                        <div
                          key={index}
                          className='absolute w-full h-56 flex items-center justify-center pl-5'
                          style={{ top: `${index * 100}%` }}>
                          <div className='text-3xl font-extrabold text-black'>
                            {employee.name || "未知姓名"}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`absolute top-[12%] left-1/2 -translate-x-1/2 w-full max-w-[1400px] px-4 transition-opacity duration-500 ${
            showWinnersList ? "opacity-100" : "opacity-0"
          }`}>
          <div className='bg-white rounded-lg p-4 shadow-lg max-h-[1000px] overflow-y-auto'>
            <h2 className='text-3xl font-bold text-center py-5 text-black leading-relaxed tracking-widest'>
              {prizeName}
            </h2>
            <div className='grid grid-cols-4 gap-4 text-center font-bold text-lg mb-4 border-b border-black p-4'>
              <div className='text-2xl'>所屬部門</div>
              <div className='text-2xl'>員工編號</div>
              <div className='text-2xl'>姓名</div>
            </div>
            <div
              style={{
                minHeight:
                  winners.length > 0 ? `${winners.length * 50 + 100}px` : "0px",
              }}>
              {winners.map((winner, index) => (
                <div
                  key={index}
                  className='grid grid-cols-4 gap-4 text-center text-xl py-1 border-b border-gray-300 justify-center items-center'>
                  <div className='font-bold tracking-widest'>
                    {winner?.department || "未知部門"}
                  </div>
                  <div className='font-bold tracking-widest'>
                    {winner?.employee_id || "未知編號"}
                  </div>
                  <div className='font-bold tracking-widest'>
                    {winner?.name || "未知姓名"}
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
              <Button
                onClick={submitWinners}
                variant='ghost'
                className='my-4 font-bold tracking-widest text-lg'
                disabled={isSubmitting || allWinnersHistory.length === 0}>
                {isSubmitting ? "提交中..." : "確認送出"}
              </Button>
            </div>
          </div>
        </div>

        <div className='absolute bottom-30 left-1/2 -translate-x-1/2 w-full text-center'>
          <div className='text-3xl font-extrabold text-white tracking-widest pr-20'>
            {redrawMode
              ? "重新抽獎中..."
              : showWinnersList
              ? ""
              : `抽獎進度: ${winners.length} / ${totalWinners}`}
          </div>
        </div>
      </div>
    </div>
  )
}
