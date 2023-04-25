import React from "react";
import "./styles.scss"

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const EDIT = "EDIT";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode (
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true))
  }

  function edit() {
    transition(EDIT);
  }

  function remove() {
    if (mode === CONFIRM) {
      transition(DELETING, true)
      props.cancelInterview(props.id)
        .then(() => transition(EMPTY))
        .catch(() => transition(ERROR_DELETE, true))
    } else {
      transition(CONFIRM);      
    }
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition("CREATE")} />}
      {mode === SHOW && (
       <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onEdit={edit}
        onDelete={remove}
       />
      )}
      {mode === CREATE && 
        <Form
          name={props.name}
          value={props.value}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />}
      {mode === SAVING && <Status message="Saving..."/>}
      {mode === CONFIRM && 
        <Confirm
        onCancel={back}
        onConfirm={remove}
        message = "Are you sure you would like to delete?"
        />}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === EDIT &&
        <Form 
          name={props.name ? props.name : props.interview.student}
          value={props.value ? props.value: props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      }
      {mode === ERROR_SAVE && 
        <Error 
          message="Could not create appointment"
          onClose={back}
        />
      }
      {mode === ERROR_DELETE && 
        <Error 
          message="Could not cancel appointment"
          onClose={back}
        />
      }
    </article>
  );
}