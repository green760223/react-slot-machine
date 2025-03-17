/**
 * API Interfaces and Types
 */

export interface Result<T = any> {
  data?: T
}

export namespace Employee {
  export interface Info {
    id: number
    name: string
    department: string
    group: string
    employee_id: string
    prize: string
    is_won: boolean
    is_donated: boolean
    lottery_eligibility: string
  }
}

export namespace Winner {
  export interface Info {
    id: number
    name: string
    group: string
    department: string
    employee_id: string
    prize: string
    is_won: boolean
    is_donated: boolean
  }
}
