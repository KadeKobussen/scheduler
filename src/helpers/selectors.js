export function getAppointmentsForDay(state, day) {
  const dayObject = state.days.find((d) => d.name === day);
  if (!dayObject) {
    return [];
  }
  const appointments = dayObject.appointments.map(
    (id) => state.appointments[id]
  );
  return appointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewer = state.interviewers[interview.interviewer];

  return {
    student: interview.student,
    interviewer: interviewer
  };
}
export function getInterviewersForDay(state, day) {
  const selectedDay = state.days.find((d) => d.name === day);
  if (!selectedDay || selectedDay.interviewers.length === 0) {
    return [];
  }

  const interviewers = selectedDay.interviewers.map((id) => state.interviewers[id]);
  return interviewers;
}

