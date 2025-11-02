import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import * as holiday_jp from '@holiday-jp/holiday_jp';
import format from '@holiday-jp/holiday_jp/lib/format';

import "react-calendar/dist/Calendar.css";
import "./App.css";

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
  "1部": new Date(2025, 0, 13),  // 2025/01/13
  "2部": new Date(2025, 0, 6),   // 2025/01/06
  "3部": new Date(2024, 11, 30), // 2024/12/30
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

  const getHolidayName = (date: Date) => {
    return holiday_jp.holidays[format(date)]?.name;
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
        tileContent={({ date, view }) => {
          if (view === 'month') {
            const duty = getDutyType(date);
            const holidayName = getHolidayName(date);
            return (
              <div style={{ marginTop: 4 }}>
                <small className="duty-label">{duty}</small>
                {holidayName && (
                  <small className="holiday-label">{holidayName}</small>
                )}
              </div>
            )
          }
        }}
        tileClassName={({ date, view }) =>
          view === 'month' && getDutyType(date) === '当番' ? 'on-duty' : undefined
        }
      />
    </div>
  );
}

export default App;
