"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IssueTable;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function IssueRow(_ref) {
  var issue = _ref.issue;
  return /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement("td", null, issue.id), /*#__PURE__*/_react.default.createElement("td", null, issue.status), /*#__PURE__*/_react.default.createElement("td", null, issue.owner), /*#__PURE__*/_react.default.createElement("td", null, issue.created.toDateString()), /*#__PURE__*/_react.default.createElement("td", null, issue.effort), /*#__PURE__*/_react.default.createElement("td", null, issue.due ? issue.due.toDateString() : ''), /*#__PURE__*/_react.default.createElement("td", null, issue.title));
}

function IssueTable(_ref2) {
  var issues = _ref2.issues;
  var issueRows = issues.map(function (issue) {
    return /*#__PURE__*/_react.default.createElement(IssueRow, {
      key: issue.id,
      issue: issue
    });
  });
  return /*#__PURE__*/_react.default.createElement("table", {
    className: "bordered-table"
  }, /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement("th", null, "ID"), /*#__PURE__*/_react.default.createElement("th", null, "Status"), /*#__PURE__*/_react.default.createElement("th", null, "Owner"), /*#__PURE__*/_react.default.createElement("th", null, "Created"), /*#__PURE__*/_react.default.createElement("th", null, "Effort"), /*#__PURE__*/_react.default.createElement("th", null, "Due Date"), /*#__PURE__*/_react.default.createElement("th", null, "Title"))), /*#__PURE__*/_react.default.createElement("tbody", null, issueRows));
}