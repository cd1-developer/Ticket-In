import { File, Filter, Check } from "lucide-react";
import { LoaderFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { PopupCard } from "~/components/PopUpCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import axios from "axios";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import PaginationComponent from "~/components/PaginationComponent";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Loading } from "~/components/Loader";
import toast from "react-hot-toast";
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
type Progress = {
  id: string;
  markDone: boolean;
  progressStatus: ProgressStatus;
};

export const loader: LoaderFunction = async () => {
  const result = await axios.get(`${process.env.API_ENDPOINT}/getTicketIn`);
  const ticketInData = result?.data.ticketInData;
  return { ticketInData, apiEndPoint: process.env.API_ENDPOINT };
};
const TicketIn = () => {
  const ticketInData = useLoaderData<typeof loader>().ticketInData;
  const apiEndPoint = useLoaderData<typeof loader>().apiEndPoint;

  const headers = [
    "Subscription",
    "AV Username",
    "IG User Name",
    "Placement",
    "Description",
    "Assign To",
    "Team ID",
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
  const [progress, setProgress] = useState<Progress | null>(null);
  const itemsPerPage = 5; // Show 5 rows per page as requested

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

  let filterValue = ticketInData.map((ticket: Ticket) => {
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
  });

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
    let shortText = text?.slice(0, 15);
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

  async function saveHandler() {
    if (progress) {
      const { id, progressStatus, markDone }: Progress = progress;
      const response = await axios.post(`${apiEndPoint}/updateTicket`, {
        id,
        progressStatus,
        markDone,
      });
      toast.success(response.data.message);
      revalidate();
      setProgress({
        id: "",
        progressStatus: ProgressStatus.Todo,
        markDone: false,
      });
    }
  }

  if (state === "loading") {
    return <Loading />;
  }
  return (
    <div className="text-[#5D5FEF] front-[Work Sans] h-full min-w-screen overflow-y-hidden">
      <div className="p-4 ">
        <div className="grid grid-rows-2 gap-4 border-3 px-2">
          <h2 className="text-2xl font-bold">Ticket Details</h2>
          <div className="flex justify-between items-center px-2">
            <div className="flex gap-8">
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
              className="bg-[#5D5FEF] text-gray-200"
              onClick={() => setIsOpen(true)}
            >
              <Filter /> <span>Filter</span>
            </Button>
          </div>
          <div className="grid grid-cols-9 justify-center ml-1 border-b">
            {headers.map((header: string, index) => (
              <h2 key={index} className="text-[#878790]">
                {header}
              </h2>
            ))}
          </div>

          <Accordion type="single" collapsible>
            {currentTickets?.map((ticket: Ticket) => (
              <AccordionItem value={ticket._id} key={ticket._id}>
                <AccordionTrigger className="grid grid-cols-10  text-sm text-[#3A3A49] border-b justify-center py-5 relative mt-4 ">
                  <div className="absolute top-[-0.5rem] flex gap-5 items-center">
                    <h2>{formateDate(ticket.date)}</h2>
                    <h2
                      className={`text-xs p-1 rounded-md text-white ${
                        ticket.priority === "Critical"
                          ? "bg-red-500"
                          : ticket.priority === "Emergency"
                          ? "bg-red-700"
                          : ticket.priority === "Urgent"
                          ? "bg-red-600"
                          : ticket.priority === "Medium"
                          ? "bg-orange-400"
                          : ticket.priority === "Normal"
                          ? "bg-green-500"
                          : "bg-gray-700"
                      }`}
                    >
                      {ticket.priority}
                    </h2>
                  </div>
                  <h2>{shortenString(ticket.subscriptionId || "Not Found")}</h2>
                  <h2>{shortenString(ticket.avUsername || "Not Found")}</h2>
                  <h2 className="ml-10">{ticket.igUsername || "Not Found"}</h2>
                  <h2 className="ml-14">{ticket.placement || "Not Found"}</h2>
                  <h2 className="ml-20">{ticket.description}</h2>
                  <h2 className="ml-24 text-wrap">
                    {shortenString(ticket.assignTo)}
                  </h2>
                  <h2 className="ml-24">{shortenString(ticket.teamId)}</h2>

                  <Select
                    defaultValue={ticket.progressStatus}
                    key={ticket.progressStatus}
                    onValueChange={(value) => {
                      setProgress((prev) => {
                        if (prev && prev?.id === ticket._id) {
                          return {
                            ...prev,
                            progressStatus: value as ProgressStatus,
                          };
                        }
                        return {
                          id: ticket._id,
                          progressStatus: value as ProgressStatus,
                          markDone: ticket.markDone,
                        };
                      });
                    }}
                  >
                    <SelectTrigger className="w-[120px] ml-24">
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
                  <Checkbox
                    className="ml-[10rem]"
                    checked={
                      progress?.id === ticket._id
                        ? progress?.markDone
                        : ticket.markDone
                    }
                    onCheckedChange={() =>
                      setProgress((prev) => {
                        if (prev && prev?.id === ticket._id) {
                          return { ...prev, markDone: !prev.markDone };
                        }
                        return {
                          id: ticket._id,
                          progressStatus: ticket.progressStatus, // Fix incorrect reference
                          markDone: !ticket.markDone, // Toggle initial value correctly
                        };
                      })
                    }
                  />
                  <Button className="w-20 ml-20" onClick={saveHandler}>
                    <File />
                    Save
                  </Button>
                </AccordionTrigger>
                <AccordionContent className="p-3 flex flex-col gap-4  ">
                  <div className="flex  gap-2">
                    <h2 className="text-[#878790]">Support Response</h2>
                    <h2 className="text-[#3A3A49]">{ticket.supportResponse}</h2>
                  </div>
                  <h2 className="text-[#3A3A49]">Your Message</h2>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter Your message"
                        className="w-[15%]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      {message !== "" && (
                        <Button onClick={() => addMessage(message, ticket._id)}>
                          Add
                        </Button>
                      )}
                    </div>
                    {ticket.yourMessage.map((message: string, index) => (
                      <h2>{message}</h2>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <PaginationComponent
            totalItems={ticketInData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <PopupCard
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={"Create Filter"}
      >
        <div>
          <div className="flex flex-col gap-2">
            <ScrollArea className="flex flex-col gap-2 p-2 h-[200px]">
              {seachOptions.map((option: string, index) => (
                <div
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedFilterValue.value === option ? "bg-[#5D5FEF]/5" : ""
                  }`}
                >
                  <div
                    key={index}
                    onClick={() => (
                      setFilterSearch(option),
                      setselectedFilterValue({
                        value: option,
                        isChecked: true,
                      })
                    )}
                  >
                    {option}
                  </div>
                  {selectedFilterValue.isChecked &&
                  option === selectedFilterValue.value ? (
                    <Check className="h-4 w-4 text-[#5D5FEF]" />
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="flex gap-10 justify-center mb-3">
            <h2
              className="text-xs cursor-pointer hover:underline hover:text-[#5D5FEF]"
              onClick={() => setSearchParams([])}
            >
              Clear
            </h2>
            <h2
              className="text-xs cursor-pointer hover:underline hover:text-[#5D5FEF]"
              onClick={selectHandler}
            >
              {" "}
              Select
            </h2>
          </div>
          <Command className="rounded-lg border shadow-md ">
            <CommandInput
              placeholder={`search ${selectedFilterValue.value}...`}
            />
            <ScrollArea className=" rounded-md border p-4">
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                {filterValue.map((value: string, index: any) => (
                  <CommandItem key={index} className="cursor-pointer">
                    <div
                      className="flex justify-between  w-full"
                      onClick={() => handelClick(value)}
                    >
                      {" "}
                      {shortenString(value)}{" "}
                      {value !== "" &&
                        searchParams.some(
                          (param: SeachParam) =>
                            value === param.param && param.isChecked
                        ) && <Check className="h-4 w-4 text-[#5D5FEF]" />}
                    </div>
                  </CommandItem>
                ))}
              </CommandList>
            </ScrollArea>
          </Command>
          {/* <div className="flex justify-around py-1 mt-2">
            <Button>Cancel</Button>
            <Button>Cancel</Button>
          </div> */}
        </div>
      </PopupCard>
    </div>
  );
};

export default TicketIn;
