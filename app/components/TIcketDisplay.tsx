import React from "react";

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
import { Ticket } from "./TicketInCompo";
import { Badge } from "./ui/badge";

// Props interface with generic type support
interface TicketDisplayProp<T> {
  searchOptions: string[];
  filterSearch: string;
  searchValue: string;
  apiEndPoint: string;
  filteredUniqueValues: string[];
  Options: string[];
  setFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  setselectedFilterValue: React.Dispatch<React.SetStateAction<string>>;
  setSeachValue: React.Dispatch<React.SetStateAction<string>>;
  ticketData: Ticket[];
  headers: string[];
  selectAll: boolean;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValues: Record<string, boolean>;
  setSelectedValues: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const TicketDisplay = <T,>({
  searchOptions,
  filterSearch,
  setFilterSearch,
  ticketData,
  headers,
  setselectedFilterValue,
  Options,
  searchValue,
  setSeachValue,
  filteredUniqueValues,
  selectedValues,
  setSelectedValues,
  selectAll,
  setSelectAll,
  apiEndPoint,
  isActive,
  setIsActive,
}: TicketDisplayProp<T>) => {
  const { revalidate } = useRevalidator();

  // Pagination and Sheet state
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [isSlideOpen, setIsSlideOpen] = useState<boolean>(false);
  const [ticketInfo, setTicketInfo] = useState<Ticket | null>(null);

  // State for message form inside Sheet
  const [message, setMessage] = useState({ id: "", message: "" });
  const [messages, setMessages] = useState<string[]>([]);

  // Checkbox state tracking
  const [isChecked, setIsChecked] = useState<Map<string, boolean>>(new Map());

  // Initialize pagination to page 1 on component mount
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Set message list when a ticket is selected
  useEffect(() => {
    if (ticketInfo?._id) {
      setMessages([...ticketInfo.yourMessage]);
    }
  }, [ticketInfo]);

  // Set checkbox states when ticketData changes
  useEffect(() => {
    if (ticketData) {
      const initialMap = new Map(
        ticketData.map((ticket) => [ticket._id, ticket.markDone])
      );
      setIsChecked(initialMap);
    }
  }, [ticketData]);

  // "Select All" handler for filter dropdown
  const handelSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const newSelectedValues: Record<string, boolean> = {};
    filteredUniqueValues.forEach((val) => {
      newSelectedValues[val] = checked;
    });
    setSelectedValues((prev) => ({ ...prev, ...newSelectedValues }));
  };

  // Utility: Shorten long strings for UI display
  function shortenString(text: string) {
    return text.length > 17 ? text.slice(0, 18) : text;
  }

  // Pagination page change
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  // MarkDone checkbox toggle handler
  const handelChecked = (id: string, checked: boolean) => {
    setIsChecked((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, checked);
      return newMap;
    });
  };

  // Save ticket progress update
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
      revalidate();
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket. Please try again.");
    }
  }

  // Submit a message related to ticket
  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessages((prev) => [message.message, ...prev]);
    setMessage({ id: "", message: "" });

    const result = await axios.post(`${apiEndPoint}/addMessage`, {
      id: message.id,
      message: message.message,
    });
    revalidate();
  }

  // Loading state if pagination not initialized
  if (currentPage === null) return <Loading />;

  // Pagination logic
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = ticketData.slice(indexOfFirstItem, indexOfLastItem);

  // Side sheet handlers
  const openSheet = () => setIsSlideOpen(true);
  const closeSheet = () => setIsSlideOpen(false);

  // Format date string from ISO to dd/mm/yyyy
  const formatData = (dateString: string) => {
    if (dateString === "Old") return dateString;
    const dateInfo = new Date(dateString);
    return `${dateInfo.getDate()}/${
      dateInfo.getMonth() + 1
    }/${dateInfo.getFullYear()}`;
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Search + Filter Bar */}
      <div className="flex gap-8 justify-between">
        <div className="flex gap-2">
          {/* Search Filter Dropdown */}
          <Select
            defaultValue={searchOptions[0]}
            value={filterSearch}
            onValueChange={setFilterSearch}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {searchOptions.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder={`Search ${filterSearch}...`}
            value={searchValue}
            onChange={(e: any) => setSeachValue(e.target.value)}
          />
        </div>

        {/* Filter Toggle Button */}
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

      {/* Tickets Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((head) => (
              <TableHead key={head}>
                {head}
                {isActive && head !== "Mark Done" && (
                  <DropdownMenu
                    onOpenChange={() => setselectedFilterValue(head)}
                  >
                    <DropdownMenuTrigger>
                      <ListFilter size={15} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder={`search ${head}...`} />
                        <div className="flex items-center space-x-2 p-2">
                          <Checkbox
                            id="select-all"
                            checked={selectAll}
                            onCheckedChange={(checked: boolean) =>
                              handelSelectAll(checked as boolean)
                            }
                          />
                          <label
                            htmlFor="select-all"
                            className="text-sm font-medium"
                          >
                            Select All
                          </label>
                        </div>
                        <ScrollArea className="rounded-md border p-4">
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {filteredUniqueValues.map((value, index) => (
                              <CommandItem key={index}>
                                <div className="flex gap-2">
                                  <Checkbox
                                    id={`value-${index}`}
                                    checked={selectedValues[value] || false}
                                    onCheckedChange={(checked: boolean) => {
                                      setSelectedValues((prev) => ({
                                        ...prev,
                                        [value]: checked as boolean,
                                      }));
                                      const allChecked = Object.values({
                                        ...selectedValues,
                                        [value]: checked as boolean,
                                      }).every(Boolean);
                                      setSelectAll(allChecked);
                                    }}
                                  />
                                  <label
                                    htmlFor={`value-${index}`}
                                    className="text-sm"
                                  >
                                    {shortenString(value)}
                                  </label>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandList>
                        </ScrollArea>
                      </Command>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentTickets.map((ticket) => (
            <TableRow
              key={ticket._id}
              onClick={() => {
                setTicketInfo(ticket);
                openSheet();
              }}
              className="cursor-pointer"
            >
              <TableCell>{ticket.TicketId}</TableCell>
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
                  onValueChange={(value: any) =>
                    saveHandler(ticket._id, value, ticket.markDone)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Options.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
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

      {/* Detail Side Sheet */}
      <Sheet isOpen={isSlideOpen} onClose={closeSheet}>
        <div className="p-2">
          <h2 className="py-2">
            Ticket ID: {String(ticketInfo?.TicketId).toUpperCase()}
          </h2>
          <Separator />

          {/* Ticket metadata display */}
          <div className="py-2 flex flex-col gap-3">
            <InfoRow
              label="Date"
              value={formatData(String(ticketInfo?.date))}
            />
            <InfoRow
              label="Subscription ID"
              value={ticketInfo?.subscriptionId}
            />
            <InfoRow label="AV Username" value={ticketInfo?.avUsername} />
            <InfoRow label="Placement" value={ticketInfo?.placement} />
            <InfoRow label="IG Username" value={ticketInfo?.igUsername} />
            <InfoRow label="Executive" value={ticketInfo?.excecutive} />
            <InfoRow label="Team ID" value={ticketInfo?.teamId} />
            <InfoRow
              label="3 Word Description"
              value={ticketInfo?.description}
            />
            <InfoRow
              label="Support Response"
              value={ticketInfo?.supportResponse || "No Response"}
            />

            <div className="flex justify-between">
              <h2>Status</h2>
              <Select
                defaultValue={ticketInfo?.progressStatus}
                key={ticketInfo?.progressStatus}
                onValueChange={(value) =>
                  saveHandler(
                    String(ticketInfo?._id),
                    value,
                    Boolean(ticketInfo?.markDone)
                  )
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Options.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message Form and Display */}
            <form onSubmit={submitHandler}>
              <input type="hidden" name="id" value={ticketInfo?._id} />
              <BottomBorderInput
                type="text"
                name="message"
                placeholder="Enter your message..."
                label="Your Message"
                value={message.message}
                onChange={(e) =>
                  setMessage({
                    id: ticketInfo?._id || "",
                    message: e.target.value,
                  })
                }
                required
              />
            </form>
            {messages.map((data, index) => (
              <h2 key={index}>{data}</h2>
            ))}
          </div>
        </div>
      </Sheet>

      {/* Pagination */}
      <PaginationComponent
        totalItems={ticketData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

// Reusable label-value row for sheet
const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between">
    <h2>{label}</h2>
    <h2>{value || "Not Found"}</h2>
  </div>
);

export default TicketDisplay;
