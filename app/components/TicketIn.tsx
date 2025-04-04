import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useRevalidator } from "@remix-run/react";
import PaginationComponent from "./PaginationComponent";
import { useState, useEffect, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Loading } from "~/components/Loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "./ui/button";
import { Filter, ListFilter, Check } from "lucide-react";
import { Sheet } from "~/components/Side-bar-sheet";
import { Separator } from "./ui/separator";
import { BottomBorderInput } from "./Bottom-border-input";

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

type TicketInCompoProp = {
  ticketInData: Ticket[];
  apiEndPoint: string;
};

function TicketInCompo({ ticketInData, apiEndPoint }: TicketInCompoProp) {
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
  const [message, setMessage] = useState({
    id: "",
    message: "",
  });

  const [selectedFilterValue, setselectedFilterValue] = useState(
    seachOptions[0]
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SeachParam[]>([]);
  const [isChecked, setIsChecked] = useState<Map<string, boolean>>(new Map());
  const [ticketData, setTicketData] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const [isSlideOpen, setIsSlideOpen] = useState<boolean>(false);
  const itemsPerPage = 10; // Show 5 rows per page as requested

  useEffect(() => {
    if (ticketInData) {
      const initialMap = new Map(
        ticketInData.map((ticket) => [ticket._id, ticket.markDone])
      );
      setIsChecked(initialMap);
    }
  }, [ticketInData]);

  useEffect(() => {
    if (ticketData?._id) {
      setMessages([...ticketData.yourMessage]);
    }
  }, [ticketData]);

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
      if (selectedFilterValue === "IG Username") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.igUsername
        );
      } else if (selectedFilterValue === "Subscription") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.subscriptionId
        );
      } else if (selectedFilterValue === "Av Username") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.avUsername
        );
      } else if (selectedFilterValue === "Placement") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.placement
        );
      } else if (selectedFilterValue === "Assign To") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.assignTo
        );
      } else if (selectedFilterValue === "Team ID") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.teamId
        );
      } else if (selectedFilterValue === "Ticket ID") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.TicketId
        );
      } else if (selectedFilterValue === "Status") {
        return searchParams.some(
          (param: SeachParam) =>
            param.isChecked && param.param === ticket.progressStatus
        );
      }
    });
  }

  // Values for seach parameters filter option

  let filterValue = ticketInData
    .map((ticket: Ticket) => {
      if (selectedFilterValue === "IG Username") {
        return ticket.igUsername;
      } else if (selectedFilterValue === "Subscription") {
        return ticket.subscriptionId;
      } else if (selectedFilterValue === "AV Username") {
        return ticket.avUsername;
      } else if (selectedFilterValue === "Placement") {
        return ticket.placement;
      } else if (selectedFilterValue === "Assign To") {
        return ticket.assignTo;
      } else if (selectedFilterValue === "Team ID") {
        return ticket.teamId;
      } else if (selectedFilterValue === "Ticket ID") {
        return ticket.TicketId;
      } else if (selectedFilterValue === "3 Word Description") {
        return ticket.description;
      } else if (selectedFilterValue === "Status") {
        return ticket.progressStatus;
      } else if (selectedFilterValue === "Mark Done") {
        return ticket.markDone;
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
    if (text.length < 17) {
      let shortText = text?.slice(0, 18);
      return shortText;
    }
    return text;
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

  // Handler for checkbox changes
  const handelChecked = (id: string, checked: boolean) => {
    setIsChecked((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, checked);
      return newMap;
    });
    console.log(isChecked.get(id));

    // Optional: Call your API here
    // saveHandler(id, checked);
  };

  async function saveHandler(
    id: string,
    progressStatus: string,
    markDone: boolean
  ) {
    if (!id) return;

    handelChecked(id, markDone);

    try {
      const response = await axios.post(`${apiEndPoint}/updateTicket`, {
        id,
        progressStatus,
        markDone,
      });

      console.log(response.data);

      revalidate();
    } catch (error) {
      console.error("Error updating ticket:", error);

      // Show error message
      toast.error("Failed to update ticket. Please try again.");
    }
  }

  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessages((prev) => [message.message, ...prev]);
    setMessage({
      id: "",
      message: "",
    });

    const result = await axios.post(`${apiEndPoint}/addMessage`, {
      id: message.id,
      message: message.message,
    });
    revalidate();
    console.log(result.data);
  }
  const openSheet = () => setIsSlideOpen(true);
  const closeSheet = () => setIsSlideOpen(false);

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

          <Button
            onClick={() => setIsActive(!isActive)}
            className={`transition-all ${
              isActive
                ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 dark:ring-offset-background"
                : ""
            }`}
          >
            <Filter /> Filter
          </Button>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((head: string) => (
                  <TableHead>
                    {head}{" "}
                    {isActive && head !== "Mark Done" ? (
                      <DropdownMenu
                        onOpenChange={() => setselectedFilterValue(head)}
                      >
                        <DropdownMenuTrigger>
                          <ListFilter size={15} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Command className="rounded-lg border shadow-md ">
                            <CommandInput placeholder={`search ${head}...`} />
                            <div className="flex gap-2 p-2 justify-evenly">
                              <h2
                                className="text-xs cursor-pointer"
                                onClick={() => setSearchParams([])}
                              >
                                clear
                              </h2>{" "}
                              <h2
                                className="text-xs cursor-pointer"
                                onClick={selectHandler}
                              >
                                select
                              </h2>{" "}
                            </div>
                            <ScrollArea className=" rounded-md border p-4">
                              <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>

                                {filterValue.map(
                                  (value: string, index: any) => (
                                    <CommandItem
                                      key={index}
                                      className="cursor-pointer"
                                    >
                                      <div
                                        className="flex justify-between  w-full"
                                        onClick={() => handelClick(value)}
                                      >
                                        {" "}
                                        {shortenString(value)}{" "}
                                        {value !== "" &&
                                          searchParams.some(
                                            (param: SeachParam) =>
                                              value === param.param &&
                                              param.isChecked
                                          ) && (
                                            <Check className="h-4 w-4 text-[#5D5FEF]" />
                                          )}
                                      </div>
                                    </CommandItem>
                                  )
                                )}
                              </CommandList>
                            </ScrollArea>
                          </Command>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      ""
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTickets?.map((ticket: Ticket) => (
                <TableRow
                  key={ticket._id}
                  className="cursor-pointer"
                  onClick={() => (setTicketData(ticket), openSheet())}
                >
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
                      checked={isChecked.get(ticket._id)}
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

          <Sheet isOpen={isSlideOpen} onClose={closeSheet}>
            <div className="p-2 ">
              <h2 className="py-2">
                Ticket ID :{String("Ticket ID").toUpperCase()}
              </h2>
              <Separator />

              <div className="py-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <h2>Subscription ID</h2>
                  <h2>{ticketData?.subscriptionId || "Not Found"}</h2>
                </div>
                <div className="flex justify-between">
                  <h2>AV Username</h2>
                  <h2>{ticketData?.avUsername || "Not Found"}</h2>
                </div>
                <div className="flex justify-between">
                  <h2>Placement</h2>
                  <h2>{ticketData?.placement || "Not Found"}</h2>
                </div>
                <div className="flex justify-between">
                  <h2>IG Username</h2>
                  <h2>{ticketData?.igUsername || "Not Found"}</h2>
                </div>{" "}
                <div className="flex justify-between">
                  <h2>Excecutive</h2>
                  <h2>{ticketData?.excecutive || "Not Found"}</h2>
                </div>{" "}
                <div className="flex justify-between">
                  <h2>Team ID</h2>
                  <h2>{ticketData?.teamId || "Not Found"}</h2>
                </div>{" "}
                <div className="flex justify-between">
                  <h2>3 Word Discription</h2>
                  <h2>{ticketData?.description}</h2>
                </div>
                <div className="flex justify-between">
                  <h2>Support Response</h2>
                  <h2>{ticketData?.supportResponse || "Not Response"}</h2>
                </div>
                <div className="flex justify-between">
                  <h2>Status</h2>
                  <Select
                    defaultValue={ticketData?.progressStatus}
                    key={ticketData?.progressStatus}
                    onValueChange={(value) =>
                      saveHandler(
                        String(ticketData?._id),
                        value,
                        Boolean(ticketData?.markDone)
                      )
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
                </div>{" "}
                <div>
                  <form onSubmit={submitHandler}>
                    <input type="hidden" name="id" value={ticketData?._id} />
                    <BottomBorderInput
                      type="text"
                      name="message"
                      placeholder="Enter your message..."
                      label="Your Message"
                      value={message.message}
                      onChange={(e) =>
                        setMessage({
                          id: ticketData?._id || "",
                          message: e.target.value,
                        })
                      }
                      required
                    />
                  </form>
                  {messages.length > 0 &&
                    messages.map((data: string, index) => (
                      <h2 key={index}>{data}</h2>
                    ))}
                </div>
              </div>
            </div>
          </Sheet>
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
