import { createHashRouter } from "react-router-dom"
import PhaseOneA from "../components/PhaseOne/PhaseOneA"
import PhaseOneB from "../components/PhaseOne/PhaseOneB"

export const router = [
  {
    path: "/phase-one-a",
    element: <PhaseOneA />,
  },
  {
    path: "/phase-one-b",
    element: <PhaseOneB />,
  },
]

export default createHashRouter(router)
