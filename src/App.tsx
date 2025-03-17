import PhaseOneA from "./components/PhaseOne/PhaseOneA"
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
      {/* <SlotMachine /> */}
      {/* <PhaseOneAndOne /> */}
      <PhaseOneA />
    </div>
  )
}

export default App
