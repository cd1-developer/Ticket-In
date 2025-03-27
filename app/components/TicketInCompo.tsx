import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useRevalidator } from "@remix-run/react";
import PaginationComponent from "./PaginationComponent";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loading } from "~/components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "./ui/button";
import { Filter } from "lucide-react";

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
type SeachParam = {
  param: string;
  isChecked: boolean;
};

function TicketInCompo({
  ticketInData,
  apiEndPoint,
}: {
  ticketInData: Ticket[];
  apiEndPoint: string;
}) {
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

  const seachOptions = [
    "IG Username",
    "Subscription",
    "Av Username",
    "Placement",
    "Assign To",
    "Team ID",
    "Ticket ID",
  ];
  const { revalidate, state } = useRevalidator();
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [searchValue, setSeachValue] = useState<string>("");
  const [filterSeach, setFilterSearch] = useState<string>(seachOptions[0]);
  const [message, setMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFilterValue, setselectedFilterValue] = useState({
    value: seachOptions[0],
    isChecked: false,
  });
  const [searchParams, setSearchParams] = useState<SeachParam[]>([]);
  const [isChecked, setIsChecked] = useState<Record<string, boolean>>({});
  const itemsPerPage = 10; // Show 5 rows per page as requested

  // Calculate the current page's data

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  if (currentPage === null) {
    return <Loading />;
  }
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let currentTickets = ticketInData.filter((ticket: Ticket) => {
    if (filterSeach !== "") {
      if (filterSeach === "IG Username") {
        return ticket.igUsername
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      } else if (filterSeach === "Subscription") {
        return ticket.subscriptionId
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      } else if (filterSeach === "Av Username") {
        return ticket.avUsername
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      } else if (filterSeach === "Assign To") {
        return ticket.assignTo
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      } else if (filterSeach === "Team ID") {
        return ticket.teamId.toLowerCase().includes(searchValue.toLowerCase());
      } else if (filterSeach === "Ticket ID") {
        return ticket.TicketId.toLowerCase().includes(
          searchValue.toLowerCase()
        );
      } else if (filterSeach === "Placement") {
        return ticket.placement
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      }
    }
  });

  if (searchParams.length > 0) {
    currentTickets = ticketInData.filter((ticket: Ticket) => {
      if (selectedFilterValue.value === "IG Username") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.igUsername
        );
      } else if (selectedFilterValue.value === "Subscription") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.subscriptionId
        );
      } else if (selectedFilterValue.value === "Av Username") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.avUsername
        );
      } else if (selectedFilterValue.value === "Placement") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.placement
        );
      } else if (selectedFilterValue.value === "Assign To") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.assignTo
        );
      } else if (selectedFilterValue.value === "Team ID") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.teamId
        );
      } else if (selectedFilterValue.value === "Ticket ID") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.TicketId
        );
      }
    });
  }
  // Values for seach parameters filter option

  let filterValue = ticketInData
    .map((ticket: Ticket) => {
      if (selectedFilterValue.value === "IG Username") {
        return ticket.igUsername;
      } else if (selectedFilterValue.value === "Subscription") {
        return ticket.subscriptionId;
      } else if (selectedFilterValue.value === "Av Username") {
        return ticket.avUsername;
      } else if (selectedFilterValue.value === "Placement") {
        return ticket.placement;
      } else if (selectedFilterValue.value === "Assign To") {
        return ticket.assignTo;
      } else if (selectedFilterValue.value === "Team ID") {
        return ticket.teamId;
      } else if (selectedFilterValue.value === "Ticket ID") {
        return ticket.TicketId;
      }
      return undefined;
    })
    .filter((val): val is string => val !== undefined);

  filterValue = removeDuplicate(filterValue);

  if (searchValue === "" && searchParams.length === 0) {
    currentTickets = ticketInData.slice(indexOfFirstItem, indexOfLastItem);
  }
  currentTickets = currentTickets.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  function shortenString(text: string) {
    let shortText = text?.slice(0, 18);
    return shortText;
  }

  function formateDate(dateString: string) {
    if (dateString === "Old") return "Old";
    else {
      let dateInfo = new Date(dateString);
      let date = dateInfo.getDate();
      let month = dateInfo.getMonth() + 1;
      let year = dateInfo.getFullYear();
      return `${date}/${month}/${year}`;
    }
  }

  function removeDuplicate(array: any) {
    let seen = new Set();
    return array.filter((arr: any) => {
      if (seen.has(arr)) {
        return false;
      } else {
        seen.add(arr);
        return true;
      }
    });
  }

  function handelClick(value: string) {
    setSearchParams((prev) => {
      const existingIndex = prev.findIndex((param) => param.param === value);
      if (existingIndex >= 0) {
        return prev.map((item, index) =>
          index === existingIndex
            ? { ...item, isChecked: !item.isChecked }
            : item
        );
      }
      return [...prev, { param: value, isChecked: true }];
    });
  }

  function selectHandler() {
    setSearchParams(() =>
      filterValue.map((val: string) => ({ param: val, isChecked: true }))
    );
  }

  async function addMessage(message: string, id: string) {
    const response = await axios.post(`${apiEndPoint}/addMessage`, {
      id,
      message,
    });
    setMessage("");
    toast.success(response.data.message);
    revalidate();
  }

  async function saveHandler(
    id: string,
    progressStatus: string,
    markDone: boolean
  ) {
    if (!id) return;

    // Optimistically update UI

    // try {
    //   const response = await axios.post(`${apiEndPoint}/updateTicket`, {
    //     id,
    //     progressStatus,
    //     markDone,
    //   });

    //   console.log(response.data);
    //   console.log(isChecked);
    //   revalidate();
    // } catch (error) {
    //   console.error("Error updating ticket:", error);

    //   // Revert UI state if API fails
    //   setIsChecked((prev) => ({ ...prev, [id]: !markDone }));

    //   // Show error message
    //   toast.error("Failed to update ticket. Please try again.");
    // }
  }

  return (
    <div>
      <div className="flex flex-col gap-2 ">
        <div className="flex gap-8 justify-between">
          <div className="flex gap-2">
            <Select
              defaultValue={seachOptions[0]}
              value={filterSeach}
              onValueChange={(value) => setFilterSearch(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {seachOptions.map((option: string, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={`Search ${filterSeach}...`}
              onChange={(e) => setSeachValue(e.target.value)}
              value={searchValue}
            />
          </div>

          <Button>
            <Filter /> Filter
          </Button>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((head: string) => (
                  <TableHead>{head}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTickets?.map((ticket: Ticket) => (
                <TableRow key={ticket._id} className="cursor-pointer">
                  <TableCell>#Ticket ID</TableCell>
                  <TableCell>
                    {shortenString(ticket.subscriptionId || "Not Found")}
                  </TableCell>
                  <TableCell>
                    {shortenString(ticket.avUsername || "Not Found")}
                  </TableCell>
                  <TableCell>
                    {shortenString(ticket.igUsername || "Not Found")}
                  </TableCell>
                  <TableCell>
                    {shortenString(ticket.placement || "Not Found")}
                  </TableCell>
                  <TableCell>
                    {shortenString(ticket.description || "Not Found")}
                  </TableCell>
                  <TableCell>
                    {shortenString(ticket.assignTo || "Not Found")}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={ticket.progressStatus}
                      key={ticket.progressStatus}
                      onValueChange={(value) =>
                        saveHandler(ticket._id, value, ticket.markDone)
                      }
                    >
                      <SelectTrigger className="w-[120px] ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Options.map((option: string, index) => (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Checkbox
                      className="ml-5"
                      checked={isChecked[ticket._id] ?? ticket.markDone}
                      onCheckedChange={(checked) =>
                        saveHandler(
                          ticket._id,
                          ticket.progressStatus,
                          Boolean(checked)
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationComponent
            totalItems={ticketInData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default TicketInCompo;
