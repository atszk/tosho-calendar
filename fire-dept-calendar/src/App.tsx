import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// 東京消防庁の21日勤務サイクル例
const CYCLE = [
  "当番", "非番", "休み",
  "当番", "非番", "当番",
  "非番", "休み", "当番",
  "非番", "休み", "当番",
  "非番", "当番", "非番",
  "休み", "当番", "非番",
  "日勤", "休み", "休み"
];

const START_DATES = {
  "1部": new Date(2025, 0, 13), // 2025/1/13
  "2部": new Date(2025, 0, 14),
  "3部": new Date(2025, 0, 15),
};

function App() {
  const [value, onChange] = useState<Value>(new Date());
  const [activeTeam, setActiveTeam] = useState<keyof typeof START_DATES>("1部");

  const startDate = useMemo(() => START_DATES[activeTeam], [activeTeam]);

  const getDutyType = (date: Date) => {
    const diffDays =
      Math.floor(
        (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) % 21;
    return CYCLE[(diffDays + 21) % 21];
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", textAlign: "center" }}>
      <h2>東京消防庁 勤務サイクルカレンダー</h2>

      <div style={{ marginBottom: 16 }}>
        {(["1部", "2部", "3部"] as const).map((team) => (
          <button
            key={team}
            onClick={() => setActiveTeam(team)}
            style={{
              margin: "0 6px",
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              backgroundColor: activeTeam === team ? "#007bff" : "#f5f5f5",
              color: activeTeam === team ? "#fff" : "#333",
              cursor: "pointer",
            }}
          >
            {team}
          </button>
        ))}
      </div>

      <Calendar
        onChange={onChange}
        value={value}
        locale="ja-JP"
        calendarType="gregory"
        tileContent={({ date }) => (
          <small style={{ display: "block", marginTop: 4 }}>
            {getDutyType(date)}
          </small>
        )}
      />
    </div>
  );
}

export default App;
