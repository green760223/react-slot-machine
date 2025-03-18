import { createHashRouter } from "react-router-dom"
import PhaseOneA from "../components/PhaseOne/PhaseOneA"

export const router = [
  {
    path: "/phase-one-a",
    element: <PhaseOneA />,
  },
]

export default createHashRouter(router)
