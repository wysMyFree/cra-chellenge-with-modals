import React, { useState, useContext } from "react";
import { v1 as uuidv1 } from "uuid";
import axios from "axios";
import { AlertState } from "./alertContext/AlertState";
import { AlertContext } from "./alertContext/alertContext";
import { Alert } from "./components/Alert";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const url = process.env.REACT_APP_DB_URL;

const FirstModal = (props) => {
  const [title, setTitle] = useState("");
  const alert = useContext(AlertContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    props.addNote(title);
    alert.show(title);
    setTitle("");
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <form onSubmit={handleSubmit}>
          <label> Type some text please:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input type="submit" value="Save note" />
        </form>
        <Alert />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ResultsModal = ({ notes, ...props }) => {
  const alert = useContext(AlertContext);

  const sendDataToAPI = async (notes) => {
    let response = await axios
      .post(`${url}/somewhereonmars`, notes)
      .then(() => {
        alert.show("success");
      })
      .catch(() => {
        alert.show("something went wrong");
      });
  };
/*  if (response.data.resultCode === 200) {
    dispatch(getAuthUserData())
    } else {
      let message = response.data.messages.length > 0 ? response.data.messages[0] : " Incorrect ";
      dispatch(stopSubmit ("main_login", {_error: message}));
}*/
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Results Modal</h4>
        <ul>
          {notes.map((i) => {
            return <li key={i.id}>{i.note}</li>;
          })}
        </ul>
        <Alert />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={sendDataToAPI}>Send to Firebase</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

function App() {
  const [modalShow, showModal] = React.useState(false);
  const [resultsShow, showResut] = React.useState(false);
  const [notes, setNote] = useState([]);
  const addNote = (note) => {
    setNote([...notes, { note, id: uuidv1() }]);
  };
  return (
    <AlertState>
      <div className="flex center mt30">
        <Button
          className="mr20"
          variant="primary"
          onClick={() => showModal(true)}
        >
          Launch This modal
        </Button>
        <FirstModal
          show={modalShow}
          addNote={addNote}
          onHide={() => showModal(false)}
        />
        <Button variant="success" onClick={() => showResut(true)}>
          Show me Results modal
        </Button>
        <ResultsModal
          show={resultsShow}
          notes={notes}
          onHide={() => showResut(false)}
        />
      </div>
    </AlertState>
  );
}

export default App;
