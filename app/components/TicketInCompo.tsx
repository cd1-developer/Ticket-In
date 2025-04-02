import React, { useEffect, useMemo, useState } from "react";
import TicketDisplay from "./TicketDisplay";

enum ProgressStatus {
  Todo = "Todo",
  InProgress = "In Progress",
  Hold = "Hold",
  DiscussWithExecutive = "Discuss With Executive",
  DiscussWithSenior = "Discuss With Senior",
  Complete = "Complete",
}

export interface Ticket {
  _id: string;
  date: string;
  TicketId: string;
  priority: "Urgent" | "Critical" | "Normal" | "Emergency" | "Medium";
  subscriptionId: string;
  avUsername: string;
  igUsername: string;
  placement: string;
  description: string;
  yourMessage: string[]; // Fixed array type
  supportResponse: string;
  excecutive: string;
  teamId: string;
  assignTo: string;
  progressStatus: ProgressStatus;
  markDone: boolean;
}

type TicketInCompoProp = {
  ticketInData: Ticket[];
  apiEndPoint: string;
};
type DropdownFilter = {
  header: string;
  filterValue: string[];
};

function TicketIn({ ticketInData, apiEndPoint }: TicketInCompoProp) {
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

  const Options: ProgressStatus[] = [
    ProgressStatus.Todo,
    ProgressStatus.InProgress,
    ProgressStatus.Hold,
    ProgressStatus.DiscussWithExecutive,
    ProgressStatus.DiscussWithSenior,
    ProgressStatus.Complete,
  ];

  const [filterSearch, setFilterSearch] = useState<string>(searchOptions[0]);
  const [selectedFilterValue, setselectedFilterValue] = useState(
    searchOptions[0]
  );
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>(
    {}
  );

  const [searchValue, setSeachValue] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(true);

  let ticketInfo = ticketInData;
  ticketInfo = ticketInData.filter((ticket: Ticket) => {
    if (filterSearch !== "") {
      if (filterSearch === "IG Username") {
        return ticket.igUsername
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      } else if (filterSearch === "Subscription") {
        return ticket.subscriptionId
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      } else if (filterSearch === "Av Username") {
        return ticket.avUsername
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      } else if (filterSearch === "Assign To") {
        return ticket.assignTo
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      } else if (filterSearch === "Team ID") {
        return ticket.teamId.toLowerCase().includes(searchValue.toLowerCase());
      } else if (filterSearch === "Ticket ID") {
        return ticket.TicketId.toLowerCase().includes(
          searchValue.toLowerCase()
        );
      } else if (filterSearch === "Placement") {
        return ticket.placement
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      }
    }
  });

  const [filteredTickets, setFilteredTickets] = useState<Ticket[] | []>(
    ticketInfo
  );

  // Getting Filter values which are doing to select based on filter  ----> selectedFilterValue === "IG username"
  const getUniqueValues = (selectedFilterValue: string) => {
    return Array.from(
      new Set(
        ticketInData
          .map((ticket) => {
            switch (selectedFilterValue) {
              case "IG Username":
                return ticket.igUsername;
              case "Subscription":
                return ticket.subscriptionId;
              case "AV Username":
                return ticket.avUsername;
              case "Placement":
                return ticket.placement;
              case "3 Word Description":
                return ticket.description;
              case "Assign To":
                return ticket.assignTo;
              case "Status":
                return ticket.progressStatus;

              default:
                return undefined;
            }
          })
          .filter((val): val is string => val !== undefined && val !== "")
      )
    ).sort((a, b) => a.localeCompare(b)); // remove Duplicate
  };

  useEffect(() => {
    if (selectedFilterValue) {
      const uniqueValues = getUniqueValues(selectedFilterValue);
      const initialSelectedValues: Record<string, boolean> = {};
      uniqueValues.forEach((value) => {
        initialSelectedValues[value] = true;
      });
      setSelectedValues(initialSelectedValues);
      setSelectAll(true);
    }
  }, [selectedFilterValue]);

  useEffect(() => {
    // Get selected values that are marked as true
    const selectedValueList = Object.entries(selectedValues)
      .filter(([_, isSelected]) => isSelected)
      .map(([val]) => val);

    let filteredData: Ticket[] = [];

    if (selectedFilterValue === "IG Username") {
      filteredData = ticketInfo.filter((ticket: Ticket) =>
        selectedValueList.includes(ticket.igUsername)
      );
    } else if (selectedFilterValue === "Subscription") {
      filteredData = ticketInfo.filter((ticket: Ticket) =>
        selectedValueList.includes(ticket.subscriptionId)
      );
    } else if (selectedFilterValue === "Placement") {
      filteredData = ticketInfo.filter((ticket: Ticket) =>
        selectedValueList.includes(ticket.placement)
      );
    } else if (selectedFilterValue === "3 Word Description") {
      filteredData = ticketInfo.filter((ticket: Ticket) =>
        selectedValueList.includes(ticket.description)
      );
    } else if (selectedFilterValue === "Assign To") {
      filteredData = ticketInfo.filter((ticket: Ticket) =>
        selectedValueList.includes(ticket.assignTo)
      );
    } else if (selectedFilterValue === "3 Word Description") {
      filteredData = ticketInfo.filter((ticket: Ticket) =>
        selectedValueList.includes(ticket.description)
      );
    } else if (selectedFilterValue === "Status") {
      filteredData = ticketInfo.filter((ticket: Ticket) =>
        selectedValueList.includes(ticket.progressStatus)
      );
    }
    setFilteredTickets(filteredData); // Reset when filter is not applied
  }, [selectedValues, selectedFilterValue, ticketInfo]);

  let filteredUniqueValues = useMemo(() => {
    if (!selectedFilterValue) return [];

    const uniqueValue = getUniqueValues(selectedFilterValue);
    return uniqueValue;
  }, [selectedFilterValue]);

  return (
    <TicketDisplay<Ticket>
      searchOptions={searchOptions}
      filterSearch={filterSearch}
      setFilterSearch={setFilterSearch}
      ticketData={filteredTickets}
      headers={headers}
      setselectedFilterValue={setselectedFilterValue} // Ensure this matches TicketDisplay prop name
      Options={Options}
      searchValue={searchValue}
      setSeachValue={setSeachValue}
      filteredUniqueValues={filteredUniqueValues}
      selectedValues={selectedValues}
      setSelectedValues={setSelectedValues}
      selectAll={selectAll}
      setSelectAll={setSelectAll}
    />
  );
}

export default TicketIn;
