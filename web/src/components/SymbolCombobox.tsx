import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import APIClient from "../utils/api";
import { Stock } from "../utils/types";

export default function SymbolCombobox({
  className,
  onSelect,
}: {
  className?: string;
  onSelect?: (stock: Stock) => void;
}) {
  const [selected, setSelected] = useState<Stock | undefined | null>(undefined);
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (query.length > 0) {
        const json = await new APIClient().listStocks(query);
        setStocks(json);
      }
    };
    fetchData();
  }, [query]);

  const handleAddSymbol = () => {
    setSelected(null);
    if (selected) {
      onSelect && onSelect(selected);
    }
  };

  return (
    <div className={className}>
      <Combobox
        value={selected}
        onChange={(val) => {
          setSelected(val);
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(stock?: any) => stock?.symbol}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute w-96 mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {stocks.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                stocks.map((stock) => (
                  <Combobox.Option
                    key={stock.symbol}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-indigo-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={stock}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {stock.symbol} - {stock.shortname}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          ></span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      <PlusIcon
        className="h-6 w-6 hover:cursor-pointer text-indigo-500 inline-block"
        onClick={handleAddSymbol}
      ></PlusIcon>
    </div>
  );
}
