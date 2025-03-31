import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import axios from "axios";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Appbar } from "~/components/ui/Appbar";
import { useEffect, useState } from "react";
import { Separator } from "~/components/ui/separator";
import TicketInCompo from "~/components/TicketInCompo";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Ticket Handler" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async () => {
  const result = await axios.get(`${process.env.API_ENDPOINT}/getTicketIn`);
  const ticketInData = result?.data.ticketInData;

  return { ticketInData, apiEndPoint: process.env.API_ENDPOINT };
};

export default function Index() {
  const [isDark, setDark] = useState<boolean>(false);
  const { ticketInData, apiEndPoint } = useLoaderData<typeof loader>();

  const [activeBar, setActiveBar] = useState<"in" | "out">("in");

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  function darkModeHadler() {
    const newMode = !isDark;
    setDark(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }

  return (
    <SidebarProvider>
      <Appbar
        isDark={isDark}
        setDark={darkModeHadler}
        setActiveBar={setActiveBar}
      />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2  bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {activeBar === "in" ? "Ticket In" : "Ticket Out"}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 border border-t">
          {activeBar === "in" ? (
            <TicketInCompo
              ticketInData={ticketInData}
              apiEndPoint={apiEndPoint}
            />
          ) : (
            <h2>Ticket out</h2>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
