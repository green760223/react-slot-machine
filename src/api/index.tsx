// import request from "../utils/request"
// import { Employee, Winner } from "../types/api"

// export default {
//   getEmployeeByGroupOne() {
//     return request.get<Employee.Info[]>(`/employee/get-employees-by-group-one`)
//   },

//   getEmployeeByGroupTwo() {
//     return request.get<Employee.Info[]>(`/employee/get-employees-by-group-two`)
//   },

//   getEmployeeByGroupThree() {
//     return request.get<Employee.Info[]>(
//       `/employee/get-employees-by-group-three`
//     )
//   },

//   getEmployeeByAllGroups() {
//     return request.get<Employee.Info[]>(`/employee/get-employees-by-all-groups`)
//   },

//   addWinners(winners: Winner.Info[]) {
//     return request.post(`/employee/add-winners`, { winners })
//   },
// }

// src/api/index.tsx
import request from "../utils/request"
import { Employee, Winner } from "../types/api"

export default {
  getEmployeeByGroupOne() {
    return request.get<Employee.Info[]>(`/employee/get-employees-by-group-one`)
  },

  getEmployeeByGroupTwo() {
    return request.get<Employee.Info[]>(`/employee/get-employees-by-group-two`)
  },

  getEmployeeByGroupThree() {
    return request.get<Employee.Info[]>(
      `/employee/get-employees-by-group-three`
    )
  },

  getEmployeeByAllGroups() {
    return request.get<Employee.Info[]>(`/employee/get-employees-by-all-groups`)
  },

  addWinners(winners: Winner.Info[]) {
    return request.post(`/employee/add-winners`, { winners })
  },

  getByEndpoint(endpoint: string) {
    return request.get<Employee.Info[]>(endpoint)
  },
}
