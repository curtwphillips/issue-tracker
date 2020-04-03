let aboutMessage = 'Issue Tracker API v1.0';

function setMessage(_, { message }) {

}

function getMessage() {
  return aboutMessage;
}

module.exports = { getMessage, setMessage };
