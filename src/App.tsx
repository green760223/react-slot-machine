// import SlotMachine from "./components/SlotMachine"
import SlotMachineV2 from "./components/SlotMachineV2"
import "./App.css"

const App = () => {
  return (
    <div
      className='App '
      style={
        {
          // backgroundImage: "url(/background.png)",
          // backgroundSize: "cover",
          // backgroundRepeat: "no-repeat",
          // backgroundPosition: "center",
          // minHeight: "100vh",
          // maxWidth: "100vw",
          // display: "flex",
          // flexDirection: "column",
          // color: "white",
          // textAlign: "center",
        }
      }>
      {/* <p className='mt-55 font-bold text-6xl'>
        「貴賓獎」 現金 $ 20,000元，共五位
      </p>
      <p className='mt-10 mb-60 font-bold text-6xl'>
        感谢 中菲行國際物流集團創辦人 錢義懷先生 贊助
      </p> */}
      {/* <SlotMachine /> */}
      <SlotMachineV2 />

      {/* <p className='mt-50 font-bold text-6xl tracking-widest'>
        抽獎組別: A/B/C
      </p> */}
    </div>
  )
}

export default App
