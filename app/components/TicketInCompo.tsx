import React, { useState } from "react";
import TIcketDisplay from "./TIcketDisplay";

enum ProgressStatus {
  Todo = "Todo",
  InProgress = "In Progress",
  Hold = "Hold",
  DiscussWithExecutive = "Discuss With Executive",
  DiscussWithSenior = "Discuss With Senior",
  Complete = "Complete",
}

type Ticket = {
  _id: string;
  date: string;
  TicketId: string;
  priority: "Urgent" | "Critical" | "Normal" | "Emergency" | "Medium";
  subscriptionId: string;
  avUsername: string;
  igUsername: string;
  placement: string;
  description: string;
  yourMessage: [string];
  supportResponse: string;
  excecutive: string;
  teamId: string;
  assignTo: string;
  progressStatus: ProgressStatus;
  markDone: boolean;
};

type TicketInCompoProp<T> = {
  ticketInData: T[]; // Using a generic type parameter
  apiEndPoint: string;
};
function TicketIn<T extends Ticket>({
  ticketInData,
  apiEndPoint,
}: TicketInCompoProp<T>) {
  const searchOptions = [
    "IG Username",
    "Subscription",
    "Av Username",
    "Placement",
    "Assign To",
    "Team ID",
    "Ticket ID",
  ];
  const headers = [
    "Ticket ID",
    "Subscription",
    "AV Username",
    "IG Username",
    "Placement",
    "3 Word Description",
    "Assign To",
    "Status",
    "Mark Done",
  ];

  const [filterSearch, setFilterSearch] = useState<string>(searchOptions[0]);

  const [selectedFilterValue, setselectedFilterValue] = useState(
    searchOptions[0]
  );
  return (
    <TIcketDisplay
      searchOptions={searchOptions}
      filterSearch={filterSearch}
      setFilterSearch={setFilterSearch}
      ticketData={ticketInData}
      headers={headers}
      setFilterSearchValue={setselectedFilterValue}
    />
  );
}

export default TicketIn;
