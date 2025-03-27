import { Moon, Sun, TicketCheck, Tickets } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";

export function Appbar({
  isDark,
  setDark,
  setActiveBar,
}: {
  isDark: boolean;
  setDark: () => void;
  setActiveBar: (ticket: "in" | "out") => void;
}) {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex flex-col gap-3">
                <SidebarMenuButton
                  className="flex  gap-2 select-none cursor-pointer"
                  onClick={() => setActiveBar("in")}
                >
                  <TicketCheck /> <span>Ticket In</span>
                </SidebarMenuButton>
                <SidebarMenuButton className="flex  gap-2 text-gray-400 cursor-not-allowed select-none rounded-md">
                  <Tickets /> <span>Ticket out (coming soon) </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        onClick={setDark}
        className="cursor-pointer select-none border-t "
      >
        <h2 className="px-4 flex gap-2 font-medium text-sm items-center">
          {isDark ? "Light" : "Dark"} Mode{" "}
          <span className="text-sm">{isDark ? <Sun /> : <Moon />}</span>
        </h2>
      </SidebarFooter>
    </Sidebar>
  );
}
