import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Button from "./Button";
import Input from "./Input";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Ellipsis } from "lucide-react";
import Select from "react-select";
import majors from "./majors.json";
import { dataClient } from "../dataClient";
import { planQueryOptions } from "../queryOptions";

type Props = {
  id: string;
  minimal?: boolean;
};

type Semester = {
  id: string;
  classes: any[]; // TODO create new class type

  // semester date range?
};

const defaultDetails: any = {
  "First Year": [
    {
      id: "1",
      name: "Fall",
      classes: [],
    },
    {
      id: "2",
      name: "Spring",
      classes: [],
    },
    {
      id: "3",
      name: "Summer",
      classes: [],
    },
  ],
  "Second Year": [
    {
      id: "1",
      name: "Fall",
      classes: [],
    },
    {
      id: "2",
      name: "Spring",
      classes: [],
    },
    {
      id: "3",
      name: "Summer",
      classes: [],
    },
  ],

  "Third Year": [
    {
      id: "1",
      name: "Fall",
      classes: [],
    },
    {
      id: "2",
      name: "Spring",
      classes: [],
    },
    {
      id: "3",
      name: "Summer",
      classes: [],
    },
  ],

  "Fourth Year": [
    {
      id: "1",
      name: "Fall",
      classes: [],
    },
    {
      id: "2",
      name: "Spring",
      classes: [],
    },
    {
      id: "3",
      name: "Summer",
      classes: [],
    },
  ],
};

const options = majors.map((major: string) => ({
  value: major,
  label: major,
}));

function FourYearPlanDetails({ id, minimal }: Props) {
  const query = useQuery(planQueryOptions(id));
  const [details, setDetails] = useState<any>({ ...defaultDetails });
  const [isAddingClass, setIsAddingClass] = useState<string | null>(null);
  const [classSearch, setClassSearch] = useState("");
  const [settingsClicked, setSettingsClicked] = useState<string | null>(null);
  const addClassInputRef = useRef<HTMLDivElement | null>(null);
  const addClassContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [major, setMajor] = useState("");
  const [model, setModel] = useState<any>({});
  const [yearAndSemester, setYearAndSemester] = useState<any>({
    year: null,
    semester: null,
  });

  const headers = [
    "Course Code",
    "Course Title",
    // "Reason",
    "Prerequisites",
    "Credits",
  ];

  const years = Object.keys(details);

  const addClass = async (classSelected: any, year: any, semester: any) => {
    const c = {
      code: classSelected.code,
      name: classSelected.name,
      reason: "None",
      prereqs: classSelected.prereq_codes,
      credits: parseInt(classSelected.credit),
      year,
      semester,
    };

    const classId = await dataClient.addClassToPlan(c, id);

    const _details = { ...details };
    _details[year].forEach((s: any) => {
      if (s.name === semester) {
        s.classes.push({
          id: classId,
          code: c.code,
          name: c.name,
          reason: c.reason,
          prereqs: c.prereqs,
          credits: c.credits,
        });
      }
    });

    setDetails(_details);
  };

  const deleteClass = async (classId: any, year: any, semester: any) => {
    await dataClient.deleteClassFromPlan(classId);

    const _details = { ...details };
    _details[year].forEach((s: any) => {
      if (s.name === semester) {
        s.classes = s.classes.filter((c: any) => c.id != classId);
      }
    });

    setDetails(_details);
  };

  const onChangeMajor = async (newMajor: string) => {
    const data = await dataClient.getSemesterPlanModel(newMajor);
    setModel(data);
    setMajor(newMajor);
  };

  useEffect(() => {
    if (query.data) {
      // console.log(query.data);
      const defaultDetails: any = {
        "First Year": [
          {
            id: "1",
            name: "Fall",
            classes: [],
          },
          {
            id: "2",
            name: "Spring",
            classes: [],
          },
          {
            id: "3",
            name: "Summer",
            classes: [],
          },
        ],
        "Second Year": [
          {
            id: "1",
            name: "Fall",
            classes: [],
          },
          {
            id: "2",
            name: "Spring",
            classes: [],
          },
          {
            id: "3",
            name: "Summer",
            classes: [],
          },
        ],

        "Third Year": [
          {
            id: "1",
            name: "Fall",
            classes: [],
          },
          {
            id: "2",
            name: "Spring",
            classes: [],
          },
          {
            id: "3",
            name: "Summer",
            classes: [],
          },
        ],

        "Fourth Year": [
          {
            id: "1",
            name: "Fall",
            classes: [],
          },
          {
            id: "2",
            name: "Spring",
            classes: [],
          },
          {
            id: "3",
            name: "Summer",
            classes: [],
          },
        ],
      };
      const _details = { ...defaultDetails };
      // console.log(_details);
      query.data.forEach((c: any) => {
        _details[c.year].forEach((s: any) => {
          if (s.name === c.semester) {
            s.classes.push({
              id: c.id,
              code: c.code,
              name: c.name,
              reason: c.reason,
              prereqs: c.prereqs,
              credits: c.credits,
            });
          }
        });
      });

      setDetails(_details);
    }
  }, [query.isLoading]);

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  if (minimal) {
    return (
      <div className="px-2 h-full">
        {years.map((year) => {
          const yearDetails = details[year];
          return (
            <div className="w-full" key={year}>
              <p className="text-2xl">{year}</p>
              <div className="mt-2">
                {yearDetails.map((semester: any) => {
                  return (
                    <div
                      key={semester.id}
                      className={`mb-5 ${isAddingClass !== semester.id && isAddingClass && "opacity-30"}`}
                    >
                      <p className="text-lg my-3">{semester.name}</p>
                      <div className="relative flex flex-col w-full h-full bg-white shadow-md rounded-md border-slate-200 border-1">
                        <PlanTable
                          headers={headers}
                          semester={semester}
                          setIsAddingClass={setIsAddingClass}
                          isAddingClass={isAddingClass}
                          addClass={addClass}
                          deleteClass={deleteClass}
                          year={year}
                          minimal={minimal}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-2 h-full overflow-hidden">
      <div className="px-2 w-[70%] h-full overflow-y-scroll">
        {years.map((year) => {
          const yearDetails = details[year];
          return (
            <div className="w-full" key={year}>
              <p className="text-2xl">{year}</p>
              <div className="mt-2">
                {yearDetails.map((semester: any) => {
                  return (
                    <div
                      key={semester.id}
                      className={`mb-5 ${isAddingClass !== semester.id && isAddingClass && "opacity-30"}`}
                    >
                      <p className="text-lg my-3">{semester.name}</p>
                      <div className="relative flex flex-col w-full h-full bg-white shadow-md rounded-md border-slate-200 border-1">
                        <PlanTable
                          headers={headers}
                          semester={semester}
                          setIsAddingClass={setIsAddingClass}
                          isAddingClass={isAddingClass}
                          addClass={addClass}
                          deleteClass={deleteClass}
                          year={year}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-[30%]">
        <p className="text-lg">Model Semester Plans</p>
        <Select
          className="w-full"
          options={options}
          onChange={(v) => v && onChangeMajor(v.value)}
        />
        <div className="h-[90%] overflow-y-auto">
          {Object.keys(model).length === 0 && major !== "" && (
            <p>A model semester plan doesn't exist for this major.</p>
          )}
          {Object.keys(model).map((key) => (
            <div key={key} className="my-3">
              <p className="text-lg font-semibold">{key}</p>
              {model[key].map((c: any) => (
                <div
                  className="bg-slate-100 p-1 my-2 rounded-md border-1 border-slate-300"
                  key={c}
                >
                  <p>{c}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanTable({
  headers,
  semester,
  setIsAddingClass,
  isAddingClass,
  addClass,
  deleteClass,
  year,
  minimal,
}: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const searchResultsRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  let totalCredits = semester.classes.reduce((prev: number, curr: any) => {
    return prev + curr.credits;
  }, 0);

  const searchClass = async () => {
    setIsLoading(true);
    const data = await dataClient.searchClass(searchQuery);

    setIsLoading(false);

    const results = data.map((c: any) => ({
      ...c,
    }));

    setSearchResults(results);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(e.target as HTMLElement)
      ) {
        setIsAddingClass(null);
        setSearchQuery("");
        setSearchResults([]);
      }
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        searchClass();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <table className="w-full text-left table-auto min-w-max rounded-md">
      <thead>
        <tr className="rounded-md">
          {headers.map((header: string) => {
            let w = "";
            if (header === "Credits") {
              w = "w-5";
            } else if (header === "Course Code") {
              w = "w-30";
            }
            return (
              <th
                key={header}
                className={`${header !== "Credits" && "p-4"} border-b border-slate-300 bg-slate-100 ${w}`}
              >
                <p className="block text-sm font-normal leading-none text-slate-500">
                  {header}
                </p>
              </th>
            );
          })}
          {!minimal && (
            <th className="border-b border-slate-300 bg-slate-100 w-10">
              <p className="block text-sm font-normal leading-none text-slate-500"></p>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {semester.classes.map((c: any) => (
          <tr className="hover:bg-slate-50" key={c.code}>
            <td className="p-4 border-b border-slate-200">
              <p className="block text-sm">{c.code}</p>
            </td>
            <td className="p-4 border-b border-slate-200">
              <p className="block text-sm">{c.name}</p>
            </td>
            {/* <td className="p-4 border-b border-slate-200">
              <p className="block text-sm">{c.reason}</p>
            </td> */}
            <td className="p-4 border-b border-slate-200">
              <p className="block text-sm max-w-48 truncate">
                {c.prereqs.length === 0 ? "None" : c.prereqs.join(", ")}
              </p>
            </td>
            <td className="border-b border-slate-200 text-right">
              {!minimal ? (
                <p className="block text-right text-sm">{c.credits}</p>
              ) : (
                <p className="block text-center text-sm">{c.credits}</p>
              )}
            </td>
            {!minimal && (
              <td className="px-2 border-b border-slate-200">
                <button
                  className="p-2 flex items-center justify-center max-h-[40px] max-w-[40px] select-none rounded-md text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none cursor-pointer"
                  type="button"
                  onClick={() => deleteClass(c.id, year, semester.name)}
                >
                  🗑️
                  {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="w-4 h-4"
                >
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                </svg> */}
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          {!minimal && (
            <td
              colSpan={0}
              className="px-4 ptext-left border-t border-slate-300 text-sm"
            >
              <div className="relative flex items-center">
                <Input
                  placeholder="Enter course code or title..."
                  className="absolute w-50"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
                <button
                  className="absolute h-8 w-20 left-52 bg-slate-100 hover:bg-slate-200 cursor-pointer rounded-md p-1"
                  onClick={() => {
                    searchClass();
                    setIsAddingClass(semester.id);
                  }}
                >
                  🔎 Search
                </button>
                {searchResults && (
                  <div className="search-results">
                    {searchResults.length === 0 &&
                      semester.id === isAddingClass &&
                      !isLoading && (
                        <div
                          className="absolute -bottom-15 w-[500px] block bg-gray-100 rounded p-2 z-50"
                          ref={searchResultsRef}
                        >
                          <p>No results found</p>
                        </div>
                      )}
                    {searchResults.length > 0 &&
                      semester.id === isAddingClass && (
                        <div
                          className="absolute -bottom-49 w-[500px] block bg-gray-100 rounded p-2 z-50"
                          ref={searchResultsRef}
                        >
                          <div className="flex items-center select-none border-b border-slate-400">
                            <p className="w-20 my-2 ml-1">Code</p>
                            <p className="w-20 pl-3">Credits</p>
                            <p className="min-w-20">Title</p>
                          </div>
                          <div className="h-30 overflow-y-auto">
                            {searchResults.map((result, i) => (
                              <div
                                key={result.code + i}
                                className="flex justify-between items-center hover:bg-gray-200 rounded cursor-pointer overflow-ellipsis"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // console.log("click class");
                                  addClass(result, year, semester.name);
                                  setIsAddingClass(null);
                                  setSearchQuery("");
                                  setSearchResults([]);
                                }}
                              >
                                <p className="w-20 my-2 ml-1">{result.code}</p>
                                <p className="w-20 text-center pr-1">
                                  {result.credit}
                                </p>
                                <p className="grow-1 max-w-[300px] overflow-ellipsis">
                                  {result.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </td>
          )}
          <td
            colSpan={3}
            className="py-4 text-left border-t border-slate-300 text-sm"
          >
            <p className="text-right font-semibold">
              Total credits: {totalCredits}
            </p>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default FourYearPlanDetails;
