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

interface TIcketDisplayProp<T> {
  searchOptions: string[];
  filterSearch: string;
  setFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  setselectedFilterValue: React.Dispatch<React.SetStateAction<string>>;
  ticketData: T[];
  headers: string[];
}
const TIcketDisplay = <T extends {}>({
  searchOptions,
  filterSearch,
  setFilterSearch,
  ticketData,
  headers,
  setselectedFilterValue,
}: TIcketDisplayProp<T>) => {
  const [searchValue, setSeachValue] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  function shortenString(text: string) {
    if (text.length < 17) {
      let shortText = text?.slice(0, 18);
      return shortText;
    }
    return text;
  }

  return (
    <div>
      <div className="flex flex-col gap-2 ">
        <div className="flex gap-8 justify-between">
          <div className="flex gap-2">
            <Select
              defaultValue={searchOptions[0]}
              value={filterSearch}
              onValueChange={(value: string) => setFilterSearch(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {searchOptions.map((option: string, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={`Search ${filterSearch}...`}
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
                          {/* <Command className="rounded-lg border shadow-md ">
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
                          </Command> */}
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

          {/* <Sheet isOpen={isSlideOpen} onClose={closeSheet}>
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
          </Sheet> */}
          {/* <PaginationComponent
            totalItems={ticketData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default TIcketDisplay;
