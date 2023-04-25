import { useState, useEffect } from "react";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "../helpers/selectors";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  const updateSpots = (day, days, appointments) => {
    const dayObj = days.find(d => d.name === day);
    const appointmentsForDay = dayObj.appointments;
    const spots = appointmentsForDay.reduce((count, id) => {
      if (!appointments[id].interview) {
        return count + 1;
      }
      return count;
    }, 0);
    const updatedDay = { ...dayObj, spots };
    const updatedDays = days.map(d => (d.name === day ? updatedDay : d));
    return updatedDays;
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      const days = updateSpots(state.day, state.days, appointments);
      setState(prevState => ({ ...prevState, appointments, days }));
    });
  };

  const cancelInterview = id => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`).then(() => {
      const days = updateSpots(state.day, state.days, appointments);
      setState(prevState => ({ ...prevState, appointments, days }));
    });
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      const [days, appointments, interviewers] = all.map(res => res.data);
      setState(prevState => ({
        ...prevState,
        days,
        appointments,
        interviewers
      }));
    });
  }, []);

  const interviewers = getInterviewersForDay(state, state.day);

  const appointments = getAppointmentsForDay(state, state.day).map(
    appointment => {
      return {
        ...appointment,
        interview: getInterview(state, appointment.interview)
      };
    }
  );

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    interviewers,
    appointments
  };
}
