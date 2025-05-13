# 🎰 Enterprise-Scale Slot Lottery Prize Drawing System - Frontend

This is the frontend interface of the **Enterprise-Scale Slot Lottery Prize Drawing System**, a customizable, slot-style prize drawing tool designed for internal use at corporate events. Built with React and TypeScript, it provides a dynamic and engaging user experience, allowing organizers to run multi-phase raffles based on employee seniority, redraw opted-out winners, and confirm final winner lists.

![Main page preview](https://live.staticflickr.com/65535/54515927846_670f1021c0_b.jpg)

![Winner list preview](https://live.staticflickr.com/65535/54516188783_b2303ab071_b.jpg)

---

## 📌 Key Features

- 🎰 **Slot Machine-Style UI**  
  Animated drawing experience with spinning reels and sound effects.

- 🧩 **Reusable `LotteryPage` Component**  
  Drawing pages are easily configured via props—such as prize name, phase title, API endpoint, and winner count—mapped to routes.

- 🔄 **Real-Time Redraw Support**  
  Allows organizers to replace opted-out winners instantly.

- 🧑‍💼 **Seniority-Based Eligibility**  
  Each drawing phase filters employees by years of service using backend logic.

- 📄 **Confirmed Winner List Page**  
  Final winner lists are generated and displayed after redraws for transparency and record-keeping.

- 🔗 **Multi-Phase Routing System**  
  Uses React Router to map each draw phase (e.g. `/phase-1-1`) to a different page.

---

## 🛠 Tech Stack

- **Framework:** React 18 + TypeScript  
- **Styling:** Tailwind CSS  
- **Routing:** React Router (Hash-based)  
- **Build Tool:** Vite  
- **API Integration:** Axios / Fetch to communicate with FastAPI backend

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Backend API running (e.g. FastAPI at `http://localhost:8000`)

### Installation

```bash
git clone https://github.com/green760223/react-slot-machine.git
cd react-slot-machine
npm install
npm run dev
```

The frontend assumes backend endpoints like /employee/get-employees-by-group-one are available and CORS is enabled.

## ⚙️ Customizing Drawing Phases
Each drawing page is generated via React Router and the reusable LotteryPage component. Example configuration:

```bash
{
  path: "/phase-1-1",
  element: (
    <LotteryPage
      title="★ Phase 1 Lottery ★"
      subtitle="Prize NO.1–10: $3,000"
      totalWinners={10}
      apiEndpoint="/employee/get-employees-by-group-one"
      prizeName="Phase 1 – NO.1–10: $3,000"
    />
  ),
}
```

Simply extend the router array to support new prize phases or employee groups.


## 🧠 Author
Developed by Yi-Hsuan (Lawrence) Chuang

## 📄 License

This project is intended for internal corporate event use.
Contact the author for inquiries or extended licensing.
