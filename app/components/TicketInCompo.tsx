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
  yourMessage: string[];
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

function TicketIn({ ticketInData, apiEndPoint }: TicketInCompoProp) {
  // Constants
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

  // State declarations at the top
  const [filterSearch, setFilterSearch] = useState<string>(searchOptions[0]);
  const [selectedFilterValue, setselectedFilterValue] = useState<string>(
    searchOptions[0]
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>(
    {}
  );
  const [searchValue, setSeachValue] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [activeFilters, setActiveFilters] = useState<
    { type: string; values: string[] }[]
  >([]);

  // Memoized filtered tickets based on search
  const searchedTickets = useMemo(() => {
    if (!filterSearch) return ticketInData;

    const searchLower = searchValue.toLowerCase();

    return ticketInData.filter((ticket: Ticket) => {
      switch (filterSearch) {
        case "IG Username":
          return ticket.igUsername.toLowerCase().includes(searchLower);
        case "Subscription":
          return ticket.subscriptionId.toLowerCase().includes(searchLower);
        case "Av Username":
          return ticket.avUsername.toLowerCase().includes(searchLower);
        case "Assign To":
          return ticket.assignTo.toLowerCase().includes(searchLower);
        case "Team ID":
          return ticket.teamId.toLowerCase().includes(searchLower);
        case "Ticket ID":
          return ticket.TicketId.toLowerCase().includes(searchLower);
        case "Placement":
          return ticket.placement.toLowerCase().includes(searchLower);

        default:
          return true;
      }
    });
  }, [ticketInData, filterSearch, searchValue]);

  // Memoized function to get unique values for filters
  const getUniqueValues = useMemo(() => {
    return (filterType: string): string[] => {
      const values = ticketInData
        .map((ticket) => {
          switch (filterType) {
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
            case "Ticket ID":
              return ticket.TicketId;
            default:
              return undefined;
          }
        })
        .filter((val): val is string => val !== undefined && val !== "");

      return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
    };
  }, [ticketInData]);

  // Reseting Filter
  useEffect(() => {
    if (!isActive) {
      setFilterSearch(searchOptions[0]);
      setselectedFilterValue(searchOptions[0]);
      setSelectedValues({});
      setActiveFilters([]);
    }
  }, [isActive]);

  // Initialize selected values when filter type changes

  // This useEffect runs whenever the `selectedFilterValue` changes,
  // meaning the user has selected a different column to filter by (e.g., "IG Username", "Team ID").
  //
  // It gets all unique values from the selected column,
  // then marks all of them as selected by default (checked = true).
  // This makes sure that the filter dropdown shows all options selected when a new column is chosen.
  // It also sets the "Select All" checkbox to true.
  useEffect(() => {
    if (selectedFilterValue) {
      const uniqueValues = getUniqueValues(selectedFilterValue);
      const initialSelectedValues = uniqueValues.reduce((acc, value) => {
        acc[value] = true;
        return acc;
      }, {} as Record<string, boolean>);

      setSelectedValues(initialSelectedValues);
      setSelectAll(true);
    }
  }, [selectedFilterValue]);

  // Update active filters when selected values change
  useEffect(() => {
    const selectedValueList = Object.entries(selectedValues)
      .filter(([_, isSelected]) => isSelected)
      .map(([val]) => val);

    setActiveFilters((prev) => {
      const otherFilters = prev.filter((f) => f.type !== selectedFilterValue);
      return selectedValueList.length > 0
        ? [
            ...otherFilters,
            { type: selectedFilterValue, values: selectedValueList },
          ]
        : otherFilters;
    });
  }, [selectedValues, selectedFilterValue]);

  // Apply all active filters to the searched tickets

  const filteredTickets = useMemo(() => {
    let result = [...searchedTickets];

    activeFilters.forEach((filter) => {
      switch (filter.type) {
        case "IG Username":
          result = result.filter((ticket) =>
            filter.values.includes(ticket.igUsername)
          );
          break;
        case "Subscription":
          result = result.filter((ticket) =>
            filter.values.includes(ticket.subscriptionId)
          );
          break;
        case "Placement":
          result = result.filter((ticket) =>
            filter.values.includes(ticket.placement)
          );
          break;
        case "3 Word Description":
          result = result.filter((ticket) =>
            filter.values.includes(ticket.description)
          );
          break;
        case "Assign To":
          result = result.filter((ticket) =>
            filter.values.includes(ticket.assignTo)
          );
          break;
        case "Status":
          result = result.filter((ticket) =>
            filter.values.includes(ticket.progressStatus)
          );
          break;
        case "Ticket ID":
          result = result.filter((ticket) =>
            filter.values.includes(ticket.TicketId)
          );
          break;

        default:
          break;
      }
    });

    return result;
  }, [activeFilters, searchedTickets]);

  // Get unique values for the current filter type
  const filteredUniqueValues = useMemo(() => {
    if (!selectedFilterValue) return [];
    return getUniqueValues(selectedFilterValue);
  }, [selectedFilterValue, getUniqueValues]);

  return (
    <TicketDisplay<Ticket>
      searchOptions={searchOptions}
      filterSearch={filterSearch}
      setFilterSearch={setFilterSearch}
      ticketData={filteredTickets}
      headers={headers}
      setselectedFilterValue={setselectedFilterValue}
      Options={Options}
      searchValue={searchValue}
      setSeachValue={setSeachValue}
      filteredUniqueValues={filteredUniqueValues}
      selectedValues={selectedValues}
      setSelectedValues={setSelectedValues}
      selectAll={selectAll}
      setSelectAll={setSelectAll}
      apiEndPoint={apiEndPoint}
      isActive={isActive}
      setIsActive={setIsActive}
    />
  );
}

export default TicketIn;
