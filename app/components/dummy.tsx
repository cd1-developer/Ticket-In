"use client";

import { useState, useEffect, useMemo } from "react";
import { Filter, X, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Sample data
const initialData = [
  {
    id: "SUB-001",
    placement: "Feed",
    igUsername: "@user1",
    assignTo: "Team A",
  },
  {
    id: "SUB-002",
    placement: "Story",
    igUsername: "@user2",
    assignTo: "Team B",
  },
  {
    id: "SUB-003",
    placement: "Reel",
    igUsername: "@user3",
    assignTo: "Team A",
  },
  {
    id: "SUB-004",
    placement: "Feed",
    igUsername: "@user4",
    assignTo: "Team C",
  },
  {
    id: "SUB-005",
    placement: "Story",
    igUsername: "@user5",
    assignTo: "Team B",
  },
  {
    id: "SUB-006",
    placement: "Feed",
    igUsername: "@user6",
    assignTo: "Team A",
  },
  {
    id: "SUB-007",
    placement: "Reel",
    igUsername: "@user7",
    assignTo: "Team C",
  },
];

// Filter condition types
type ConditionType =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "is_empty"
  | "is_not_empty";

// Filter definition
type FilterType = {
  column: string;
  type: "condition" | "values";
  condition?: ConditionType;
  value?: string;
  values?: string[];
};

export default function GoogleSheetsFilter() {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCondition, setSelectedCondition] =
    useState<ConditionType>("contains");
  const [conditionValue, setConditionValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>(
    {}
  );
  const [selectAll, setSelectAll] = useState(true);

  // Column definitions
  const columns = [
    { key: "id", label: "Subscription ID" },
    { key: "placement", label: "Placement" },
    { key: "igUsername", label: "IG Username" },
    { key: "assignTo", label: "Assign To" },
  ];

  // Get unique values for a column
  const getUniqueValues = (column: string) => {
    const values = Array.from(
      new Set(
        initialData.map((item) => item[column as keyof typeof item] as string)
      )
    );
    return values.sort((a, b) => a.localeCompare(b));
  };

  // Initialize selected values when column changes
  useEffect(() => {
    if (activeColumn) {
      const uniqueValues = getUniqueValues(activeColumn);
      const initialSelectedValues: Record<string, boolean> = {};
      uniqueValues.forEach((value) => {
        initialSelectedValues[value] = true;
      });
      setSelectedValues(initialSelectedValues);
      setSelectAll(true);
      setSearchValue("");
      setConditionValue("");
    }
  }, [activeColumn]);

  // Filtered unique values based on search
  const filteredUniqueValues = useMemo(() => {
    if (!activeColumn) return [];

    const uniqueValues = getUniqueValues(activeColumn);
    if (!searchValue) return uniqueValues;

    return uniqueValues.filter((value) =>
      value.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [activeColumn, searchValue]);

  // Apply filters to data
  const applyFilters = (filtersToApply: FilterType[]) => {
    if (filtersToApply.length === 0) return initialData;

    return initialData.filter((row) => {
      return filtersToApply.every((filter) => {
        const cellValue = String(row[filter.column as keyof typeof row]);

        if (filter.type === "values") {
          return filter.values?.includes(cellValue);
        } else if (filter.type === "condition") {
          switch (filter.condition) {
            case "equals":
              return cellValue === filter.value;
            case "not_equals":
              return cellValue !== filter.value;
            case "contains":
              return cellValue
                .toLowerCase()
                .includes((filter.value || "").toLowerCase());
            case "not_contains":
              return !cellValue
                .toLowerCase()
                .includes((filter.value || "").toLowerCase());
            case "starts_with":
              return cellValue
                .toLowerCase()
                .startsWith((filter.value || "").toLowerCase());
            case "ends_with":
              return cellValue
                .toLowerCase()
                .endsWith((filter.value || "").toLowerCase());
            case "is_empty":
              return cellValue === "";
            case "is_not_empty":
              return cellValue !== "";
            default:
              return true;
          }
        }
        return true;
      });
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);

    if (!activeColumn) return;

    const newSelectedValues: Record<string, boolean> = {};
    filteredUniqueValues.forEach((value) => {
      newSelectedValues[value] = checked;
    });
    setSelectedValues((prev) => ({
      ...prev,
      ...newSelectedValues,
    }));
  };

  // Apply value filter
  const applyValueFilter = () => {
    if (!activeColumn) return;

    // Get selected values
    const selectedValuesList = Object.entries(selectedValues)
      .filter(([_, isSelected]) => isSelected)
      .map(([value]) => value);

    // Remove any existing filter for this column
    const updatedFilters = filters.filter((f) => f.column !== activeColumn);

    // Only add filter if not all values are selected
    if (selectedValuesList.length < getUniqueValues(activeColumn).length) {
      updatedFilters.push({
        column: activeColumn,
        type: "values",
        values: selectedValuesList,
      });
    }

    setFilters(updatedFilters);
    setData(applyFilters(updatedFilters));
    setActiveColumn(null);
  };

  // Apply condition filter
  const applyConditionFilter = () => {
    if (!activeColumn) return;

    // Skip empty value for conditions that require a value
    if (
      [
        "equals",
        "not_equals",
        "contains",
        "not_contains",
        "starts_with",
        "ends_with",
      ].includes(selectedCondition) &&
      !conditionValue
    ) {
      return;
    }

    // Remove any existing filter for this column
    const updatedFilters = filters.filter((f) => f.column !== activeColumn);

    updatedFilters.push({
      column: activeColumn,
      type: "condition",
      condition: selectedCondition,
      value: conditionValue,
    });

    setFilters(updatedFilters);
    setData(applyFilters(updatedFilters));
    setActiveColumn(null);
  };

  // Remove a filter
  const removeFilter = (column: string) => {
    const newFilters = filters.filter((f) => f.column !== column);
    setFilters(newFilters);
    setData(applyFilters(newFilters));
  };

  // Get filter display text
  const getFilterDisplayText = (filter: FilterType) => {
    if (filter.type === "values") {
      const count = filter.values?.length || 0;
      const total = getUniqueValues(filter.column).length;

      if (count === 0) return "No values selected";
      if (count === total) return "All values";

      return `${count} of ${total} selected`;
    } else if (filter.type === "condition") {
      switch (filter.condition) {
        case "equals":
          return `is equal to "${filter.value}"`;
        case "not_equals":
          return `is not equal to "${filter.value}"`;
        case "contains":
          return `contains "${filter.value}"`;
        case "not_contains":
          return `does not contain "${filter.value}"`;
        case "starts_with":
          return `starts with "${filter.value}"`;
        case "ends_with":
          return `ends with "${filter.value}"`;
        case "is_empty":
          return "is empty";
        case "is_not_empty":
          return "is not empty";
        default:
          return "";
      }
    }
    return "";
  };

  return (
    <div className="w-full p-4">
      {/* Filter tags */}
      {filters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Filters:</span>
          {filters.map((filter, index) => {
            const column =
              columns.find((c) => c.key === filter.column)?.label ||
              filter.column;

            return (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <span className="font-medium">{column}</span>{" "}
                {getFilterDisplayText(filter)}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeFilter(filter.column)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove filter</span>
                </Button>
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setFilters([]);
              setData(initialData);
            }}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="font-medium">
                  <div className="flex items-center gap-1">
                    {column.label}
                    <Popover
                      open={activeColumn === column.key}
                      onOpenChange={(open) => {
                        if (open) {
                          setActiveColumn(column.key);
                        } else {
                          setActiveColumn(null);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ${
                            filters.some((f) => f.column === column.key)
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          <Filter className="h-3 w-3" />
                          <span className="sr-only">Filter {column.label}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <Tabs defaultValue="filter-values">
                          <div className="flex items-center justify-between border-b px-3 py-2">
                            <h4 className="font-medium">
                              Filter by {column.label}
                            </h4>
                            <TabsList className="grid w-[180px] grid-cols-2">
                              <TabsTrigger value="filter-values">
                                Values
                              </TabsTrigger>
                              <TabsTrigger value="filter-condition">
                                Condition
                              </TabsTrigger>
                            </TabsList>
                          </div>

                          {/* Filter by values tab */}
                          <TabsContent
                            value="filter-values"
                            className="p-0 m-0"
                          >
                            <div className="p-3 border-b">
                              <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Search values"
                                  className="pl-8"
                                  value={searchValue}
                                  onChange={(e) =>
                                    setSearchValue(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="p-3 border-b max-h-[200px] overflow-y-auto">
                              <div className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                  id="select-all"
                                  checked={selectAll}
                                  onCheckedChange={(checked) =>
                                    handleSelectAll(checked as boolean)
                                  }
                                />
                                <label
                                  htmlFor="select-all"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Select All
                                </label>
                              </div>

                              <Separator className="my-2" />

                              {filteredUniqueValues.map((value, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-2 py-1"
                                >
                                  <Checkbox
                                    id={`value-${i}`}
                                    checked={selectedValues[value] || false}
                                    onCheckedChange={(checked) => {
                                      setSelectedValues((prev) => ({
                                        ...prev,
                                        [value]: checked as boolean,
                                      }));

                                      // Update selectAll state based on all checkboxes
                                      const allChecked = Object.values({
                                        ...selectedValues,
                                        [value]: checked as boolean,
                                      }).every(Boolean);

                                      setSelectAll(allChecked);
                                    }}
                                  />
                                  <label
                                    htmlFor={`value-${i}`}
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {value}
                                  </label>
                                </div>
                              ))}

                              {filteredUniqueValues.length === 0 && (
                                <div className="text-sm text-muted-foreground py-2 text-center">
                                  No matching values
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between p-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveColumn(null)}
                              >
                                Cancel
                              </Button>
                              <Button size="sm" onClick={applyValueFilter}>
                                OK
                              </Button>
                            </div>
                          </TabsContent>

                          {/* Filter by condition tab */}
                          <TabsContent
                            value="filter-condition"
                            className="p-0 m-0"
                          >
                            <div className="p-3 space-y-3 border-b">
                              <div className="space-y-1.5">
                                <label className="text-sm">Condition</label>
                                <Select
                                  value={selectedCondition}
                                  onValueChange={(value) =>
                                    setSelectedCondition(value as ConditionType)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="equals">
                                      Equals
                                    </SelectItem>
                                    <SelectItem value="not_equals">
                                      Does not equal
                                    </SelectItem>
                                    <SelectItem value="contains">
                                      Contains
                                    </SelectItem>
                                    <SelectItem value="not_contains">
                                      Does not contain
                                    </SelectItem>
                                    <SelectItem value="starts_with">
                                      Starts with
                                    </SelectItem>
                                    <SelectItem value="ends_with">
                                      Ends with
                                    </SelectItem>
                                    <SelectItem value="is_empty">
                                      Is empty
                                    </SelectItem>
                                    <SelectItem value="is_not_empty">
                                      Is not empty
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {!["is_empty", "is_not_empty"].includes(
                                selectedCondition
                              ) && (
                                <div className="space-y-1.5">
                                  <label className="text-sm">Value</label>
                                  <Input
                                    placeholder="Enter value"
                                    value={conditionValue}
                                    onChange={(e) =>
                                      setConditionValue(e.target.value)
                                    }
                                  />
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between p-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveColumn(null)}
                              >
                                Cancel
                              </Button>
                              <Button size="sm" onClick={applyConditionFilter}>
                                OK
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.placement}</TableCell>
                  <TableCell>{row.igUsername}</TableCell>
                  <TableCell>{row.assignTo}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  No results found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
