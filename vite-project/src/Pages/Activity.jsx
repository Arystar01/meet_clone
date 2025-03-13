import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const events = [
  {
    title: "All Day Event",
    start: new Date(2024, 2, 10),
    end: new Date(2024, 2, 11),
  },
  {
    title: "Long Event",
    start: new Date(2024, 2, 15),
    end: new Date(2024, 2, 17),
  },
];

const Activity = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="h-[600px] p-4">
      <h2 className="text-xl font-bold mb-2">Event Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        step={60}
        views={["month", "week", "day", "agenda"]}
        defaultDate={new Date()}
        style={{ height: "500px" }}
        onSelectEvent={(event) => setSelectedEvent(event)}
      />

      {selectedEvent && (
        <div className="mt-4 p-2 bg-gray-200 rounded-md">
          <h3 className="font-bold">Selected Event</h3>
          <p>Title: {selectedEvent.title}</p>
          <p>
            Start: {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}
          </p>
          <p>End: {moment(selectedEvent.end).format("MMMM Do YYYY, h:mm a")}</p>
        </div>
      )}
    </div>
  );
};

export default Activity;
