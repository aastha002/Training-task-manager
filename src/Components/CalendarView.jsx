import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarView({ tasks, onDateChange }) {
  const tileClassName = ({ date }) => {
    const taskExists = tasks[date.toDateString()];
    if (taskExists) {
      return "bg-pink-100 text-pink-700 font-semibold rounded-xl";
    }
    return "";
  };

  const tileContent = ({ date }) => {
    if (tasks[date.toDateString()]) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-auto mb-8">
      <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">
        Task Calendar
      </h2>

      <Calendar
        onChange={onDateChange}
        className="w-full text-sm border-0"
        tileClassName={tileClassName}
        tileContent={tileContent}
        nextLabel="›"
        prevLabel="‹"
        next2Label={null}
        prev2Label={null}
      />
    </div>
  );
}

export default CalendarView;
