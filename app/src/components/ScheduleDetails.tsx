import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Button from "./Button";
import Input from "./Input";
import { dataClient } from "../dataClient";
import { scheduleQueryOptions } from "../queryOptions";

type Props = {
  id: string;
  name?: string;
  minimal?: boolean;
};

function convertMilitaryToStandard(militaryTime: string) {
  let hours = parseInt(militaryTime.substring(0, 2), 10);
  let minutes = militaryTime.substring(2);

  if (hours < 0 || hours > 23 || parseInt(minutes) > 59) {
    return "Invalid time value";
  }

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 to 12 for 12AM, and 13–23 to 1–11 PM

  return `${hours}:${minutes}${period}`;
}

const colors = [
  {
    color: "bg-amber-100",
    hover: "bg-amber-200",
  },
  {
    color: "bg-sky-100",
    hover: "bg-sky-200",
  },
  {
    color: "bg-violet-100",
    hover: "bg-violet-200",
  },
  {
    color: "bg-orange-100",
    hover: "bg-orange-200",
  },
  {
    color: "bg-lime-100",
    hover: "bg-lime-200",
  },
  {
    color: "bg-rose-100",
    hover: "bg-rose-200",
  },
];

const daysMap: any = {
  Mon: "M",
  Tue: "T",
  Wed: "W",
  Thu: "R",
  Fri: "F",
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
// bad
const periods = [
  "7:25AM - 8:15AM",
  "8:30AM - 9:20AM",
  "9:35AM - 10:25AM",
  "10:40AM - 11:30AM",
  "11:45AM - 12:35PM",
  "12:50PM - 1:40PM",
  "1:55PM - 2:45PM",
  "3:00PM - 3:50PM",
  "4:05PM - 4:55PM",
  "5:10PM - 6:00PM",
  "6:15PM - 7:05PM",
];

function ScheduleDetails({ id, name, minimal }: Props) {
  const query = useQuery(scheduleQueryOptions(id));
  const [isShowingGenerator, setIsShowingGenerator] = useState(false);
  const [searchCourseCode, setSearchCourseCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [generatorCourses, setGeneratorCourses] = useState<any>([]);
  const [generatorCourse, setGeneratorCourse] = useState("");
  const [classes, setClasses] = useState<any>({});
  const [generatedClasses, setGeneratedClasses] = useState<any>(null);
  const [classesList, setClassesList] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [excludedPeriods, setExcludedPeriods] = useState<any>([]);
  const [excludedDays, setExcludedDays] = useState<any>([]);

  const [searchResults, setSearchResults] = useState<any>([]);

  const onSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    const { data } = await dataClient.searchCourse(searchCourseCode);
    // console.log(data);
    const courses = data[0]["COURSES"];
    // console.log(courses);

    let results: any = [];
    courses.forEach((course: any) => {
      const code = course.code;
      const name = course.name;
      const sections = course.sections.map((section: any) => {
        return {
          ...section,
          code,
          name,
          professor:
            section.instructors.length === 0
              ? "STAFF"
              : section.instructors[0].name,
        };
      });

      results = [...results, ...sections];
    });

    setIsSearching(false);
    setSearchResults(results);
  };

  const onAddClass = async (result: any) => {
    console.log("add", result);
    // TODO: make sure that the user can't select the same class twice

    const classToAdd = {
      code: result.code,
      professor:
        result.instructors.length === 0 ? "STAFF" : result.instructors[0].name,
      credits: result.credits,
      meeting_times: result.meetTimes.map((meeting: any) => ({
        days: meeting.meetDays.join(""),
        location: `${meeting.meetBuilding} ${meeting.meetRoom}`,
        start_period: parseInt(meeting.meetPeriodBegin),
        end_period: parseInt(meeting.meetPeriodEnd),
      })),
    };

    const classId = await dataClient.addClassToSchedule(classToAdd, id);

    const _classes: any = {
      ...classes,
    };

    let idx = Object.keys(_classes).length % colors.length;

    result.meetTimes.forEach((time: any) => {
      time.meetDays.forEach((day: any) => {
        _classes[`${day}${time.meetPeriodBegin}`] = {
          ...result,
          classId,
          periodStart: parseInt(time.meetPeriodBegin),
          periodEnd: parseInt(time.meetPeriodEnd) + 1,
          location: time.meetBuilding + " " + time.meetRoom,
          meetTimeBegin: time.meetTimeBegin,
          meetTimeEnd: time.meetTimeEnd,
          color: colors[idx],
        };
      });
    });

    setClasses(_classes);
  };

  const onRemoveClass = async (classId: string) => {
    const _classes = { ...classes };
    Object.keys(_classes).forEach((key) => {
      if (_classes[key].classId === classId) {
        console.log(_classes[key]);
        delete _classes[key];
      }
    });
    setClasses(_classes);

    await dataClient.deleteClassFromSchedule(classId);
  };

  const onAddCourseToGenerator = () => {
    setGeneratorCourses([
      ...generatorCourses,
      {
        code: generatorCourse,
      },
    ]);
    setGeneratorCourse("");
  };

  const onGenerateCourses = async () => {
    if (generatorCourses.length === 0) return;

    setIsGenerating(true);
    setGeneratedClasses(null);

    const period_lookup: any = {
      "0725": 1,
      "0815": 1,
      "0830": 2,
      "0920": 2,
      "0935": 3,
      "1025": 3,
      "1040": 4,
      "1130": 4,
      "1145": 5,
      "1235": 5,
      "1250": 6,
      "1340": 6,
      "1355": 7,
      "1445": 7,
      "1500": 8,
      "1550": 8,
      "1605": 9,
      "1655": 9,
      "1710": 10,
      "1800": 10,
      "1815": 11,
      "1905": 11,
      "1920": 12,
      "2010": 12,
    };

    const _generatedClasses: any = [];

    const data = await dataClient.generateClasses(
      generatorCourses.map((c: any) => c.code),
      {
        earliest_time: "",
        latest_time: "",
        period_blackouts: excludedPeriods,
        day_blackouts: excludedDays,
        min_instructor_rating: "",
        max_level_of_difficulty: "",
        min_would_take_again: "",
      },
    );

    console.log(data);
    const _classesList: any = {};

    data.forEach((combo: any) => {
      const cToAdd: any = {};

      combo.forEach((c: any, cIdx: any) => {
        c.times.forEach((time: any, timeIdx: any) => {
          Object.keys(time).forEach((day: any) => {
            cToAdd[`${day}${period_lookup[time[day][0]]}`] = {
              code: c.code,
              day,
              credits: c.credit,
              periodStart: period_lookup[time[day][0]],
              periodEnd: period_lookup[time[day][1]] + 1,
              location: c.locations[timeIdx],
              instructors:
                c.instructors.length === 0 ? "STAFF" : c.instructors[0],
              professor:
                c.instructors.length === 0 ? "STAFF" : c.instructors[0],
              color: colors[cIdx % colors.length],
              meetTimeBegin: convertMilitaryToStandard(time[day][0]),
              meetTimeEnd: convertMilitaryToStandard(time[day][1]),
              meetTimes: c.times.map((t: any, bruh: any) => {
                const keys = Object.keys(t);
                return {
                  meetDays: keys,
                  meetBuilding: c.locations[bruh].split(" ")[0],
                  meetRoom: c.locations[bruh].split(" ")[1],
                  meetPeriodBegin: period_lookup[t[keys[0]][0]],
                  meetPeriodEnd: period_lookup[t[keys[0]][1]],
                  meetTimeBegin: convertMilitaryToStandard(t[keys[0]][0]),
                  meetTimeEnd: convertMilitaryToStandard(t[keys[0]][1]),
                };
              }),
            };

            _classesList[c.code] =
              cToAdd[`${day}${period_lookup[time[day][0]]}`];
          });
        });
      });

      _generatedClasses.push(cToAdd);
    });

    // console.log(_generatedClasses);

    setGeneratedClasses(_generatedClasses);
    setClassesList(_classesList);
    setIsGenerating(false);
  };

  const onRemoveGeneratorCourse = (c: any) => {
    setGeneratorCourses(generatorCourses.filter((gc: any) => gc != c));
  };

  const onCopyToSchedule = async (_classes: any) => {
    const newClasses: any = {
      ...classes,
    };
    const uniqueClasses: any[] = [];
    Object.keys(_classes).forEach((c: any) => {
      const code = _classes[c].code;
      if (!uniqueClasses.find((cl: any) => cl.code === code)) {
        uniqueClasses.push(_classes[c]);
      }
    });

    uniqueClasses.forEach(async (c: any) => {
      // const c = classesList[code];
      const classToAdd = {
        code: c.code,
        professor: c.instructors.length === 0 ? "STAFF" : c.instructors[0],
        credits: c.credits,
        meeting_times: c.meetTimes.map((meeting: any) => ({
          days: meeting.meetDays.join(""),
          location: `${meeting.meetBuilding} ${meeting.meetRoom}`,
          start_period: parseInt(meeting.meetPeriodBegin),
          end_period: parseInt(meeting.meetPeriodEnd),
        })),
      };
      // const classToAdd = classesList[c.code];
      const classId = await dataClient.addClassToSchedule(classToAdd, id);

      c.meetTimes.forEach((time: any) => {
        time.meetDays.forEach((day: any) => {
          newClasses[`${day}${time.meetPeriodBegin}`] = {
            ...c,
            classId,
            periodStart: parseInt(time.meetPeriodBegin),
            periodEnd: parseInt(time.meetPeriodEnd) + 1,
            location: time.meetBuilding + " " + time.meetRoom,
            meetTimeBegin: time.meetTimeBegin,
            meetTimeEnd: time.meetTimeEnd,
          };
        });
      });
    });
    setClasses(newClasses);
  };

  const onExcludePeriods = (period: number) => {
    const temp = [...excludedPeriods];
    if (temp.indexOf(`${period}`) !== -1) {
      temp.splice(temp.indexOf(`${period}`), 1);
    } else {
      temp.push(`${period}`);
    }
    setExcludedPeriods(temp);
  };
  const onExcludeDays = (day: string) => {
    const temp = [...excludedDays];
    if (temp.indexOf(day) !== -1) {
      temp.splice(temp.indexOf(day), 1);
    } else {
      temp.push(day);
    }
    setExcludedDays(temp);
  };

  useEffect(() => {
    const data = query.data;
    if (!data) return;
    // console.log(data);

    const c: any = {};
    let prevId: any = null;
    let i = -1;
    data.forEach((item: any) => {
      if (prevId !== item.schedule_class_id) i++;
      const days = item.days.split("");
      days.forEach((day: string) => {
        c[`${day}${item.start_period}`] = {
          classId: item.schedule_class_id,
          code: item.code,
          periodStart: item.start_period,
          periodEnd: item.end_period + 1,
          location: item.location,
          // TODO: this will not work for online classes, but its fine for now
          meetTimeBegin: periods[item.start_period - 1].split("-")[0],
          meetTimeEnd: periods[item.end_period - 1].split("-")[1],
          color: colors[i % colors.length],
        };
      });
      prevId = item.schedule_class_id;
    });

    setClasses(c);
  }, [query.isLoading]);

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  if (isShowingGenerator) {
    return (
      <div className="relative h-full">
        <Button
          className="absolute -right-5 -top-17 p-2"
          onClick={() => setIsShowingGenerator(false)}
        >
          Go to Scheduler
        </Button>
        <div className="flex items-start h-full">
          <div className="min-w-[20%] flex flex-col justify-between gap-2 border-r-1 border-slate-200 h-full pr-3">
            <div>
              <div className="flex gap-2">
                <div className="grow-1 flex text-base relative max-h-9">
                  <Input
                    autoFocus
                    placeholder="Enter course code..."
                    value={generatorCourse}
                    onChange={(e) => setGeneratorCourse(e.target.value)}
                    className="grow-1"
                  />
                </div>
                <Button
                  className="py-1 px-2 text-sm max-h-9 min-w-15"
                  onClick={onAddCourseToGenerator}
                >
                  <span className="text-base">+</span> Add
                </Button>
              </div>
              <div className="text-sm">
                <p>Filters: </p>
                <div>
                  <p>Exclude periods: </p>
                  <div className="max-w-[300px] flex flex-wrap gap-2">
                    {periods.map((_, idx: any) => {
                      return (
                        <div className="flex items-center gap-1" key={idx}>
                          <label>
                            <input
                              type="checkbox"
                              // checked={isChecked}
                              onChange={() => onExcludePeriods(idx + 1)}
                            />
                          </label>
                          <p className="pb-1">{idx + 1}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p>Exclude days: </p>
                  <div className="max-w-[300px] flex flex-wrap gap-2">
                    {days.map((day: string) => {
                      return (
                        <div className="flex items-center gap-1" key={day}>
                          <label>
                            <input
                              type="checkbox"
                              // checked={isChecked}
                              onChange={() => onExcludeDays(daysMap[day])}
                            />
                          </label>
                          <p className="pb-1">{day}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div>
                {generatorCourses.map((c: any) => (
                  <div
                    className="flex items-center justify-between bg-slate-100 p-1 my-2 rounded-md border-1 border-slate-300"
                    key={c.code}
                  >
                    <p>{c.code}</p>
                    <button
                      className="text-[9px] opacity-70 hover:bg-gray-200 cursor-pointer p-2 rounded-md"
                      onClick={() => onRemoveGeneratorCourse(c)}
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <Button className="py-1" onClick={onGenerateCourses}>
              Generate
            </Button>
          </div>

          <div className="min-w-[80%] flex flex-col items-center h-full overflow-y-auto">
            {!generatedClasses && isGenerating ? (
              <p>Loading...</p>
            ) : !generatedClasses && !isGenerating ? null : generatedClasses &&
              generatedClasses.length === 0 ? (
              "No classes generated"
            ) : (
              generatedClasses.map((_classes: any, i: any) => (
                <div className="mb-20 w-[70%]" key={i}>
                  <div className="flex justify-end">
                    <Button
                      className="p-1 mb-2"
                      onClick={() => onCopyToSchedule(_classes)}
                    >
                      Use schedule
                    </Button>
                  </div>
                  <Schedule
                    classes={_classes}
                    onRemoveClass={onRemoveClass}
                    isGenerated
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (minimal) {
    return (
      <div className="h-full">
        <div className="pl-3">
          <p className="text-lg">{name}</p>
        </div>
        <Schedule
          classes={classes}
          onRemoveClass={onRemoveClass}
          minimal={minimal}
        />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <Button
        className="absolute -right-5 -top-17 p-2"
        onClick={() => setIsShowingGenerator(true)}
      >
        Go to Generator
      </Button>
      <div className="flex items-start h-full">
        <div className="min-w-[30%] flex flex-col gap-2 border-r-1 border-slate-200 h-full pr-3 overflow-y-scroll">
          <div className="flex gap-2">
            <div className="grow-1 flex text-base relative max-h-9">
              <Input
                autoFocus
                placeholder="Enter course code or title..."
                onChange={(e) => setSearchCourseCode(e.target.value)}
                className="grow-1"
              />
            </div>
            <Button className="py-1 px-2 text-sm max-h-9" onClick={onSearch}>
              <span className="text-xs">🔎</span> Search
            </Button>
          </div>
          {isSearching && <p>Loading...</p>}
          {searchResults.length !== 0 ? (
            <p className="pb-1">Results: {searchResults.length}</p>
          ) : (
            <div className="opacity-30 text-center mt-3">
              <p>Nothing yet!</p>
              <p>Try searching for a course above.</p>
            </div>
          )}
          <div>
            {searchResults.map((result: any, i: number) => {
              return (
                <div
                  className="flex items-start justify-between bg-slate-100 p-2 rounded-md mb-2 relative"
                  key={i}
                  style={{
                    minHeight: "100px",
                  }}
                >
                  <div>
                    <div className="flex items-center italic">
                      <p className="text-sm ">{result.code}</p>
                      <p className="px-2">|</p>
                      <p className="text-sm">{result.professor}</p>
                    </div>
                    <p className="py-1">{result.name}</p>
                    {result.meetTimes.length === 0 ? (
                      <p>💻 Online</p>
                    ) : (
                      <div>
                        {result.meetTimes.map((time: any, i: number) => (
                          <div key={i} className="text-sm pt-2">
                            <p>
                              {time.meetDays.join(",")} | Period:{" "}
                              {time.meetPeriodBegin} ({time.meetTimeBegin} -
                              {time.meetTimeEnd})
                            </p>
                            {time.meetBuilding === "" ? (
                              <p>📍 TBA</p>
                            ) : (
                              <p>
                                📍 {time.meetBuilding} {time.meetRoom}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="absolute right-2 top-0">
                    <p className="text-sm font-bold text-right py-1">
                      Credits: {result.credits}
                    </p>
                  </div>
                  <div className="text-sm flex justify-end pb-1 absolute right-2 bottom-2">
                    <Button className="p-2" onClick={() => onAddClass(result)}>
                      + Add
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="min-w-[70%] h-full overflow-hidden">
          <div className="pl-3">
            <p className="text-lg">{name}</p>
          </div>
          <Schedule classes={classes} onRemoveClass={onRemoveClass} />
        </div>
      </div>
    </div>
  );
}

function Schedule({ classes, onRemoveClass, isGenerated, minimal }: any) {
  return (
    <div
      className={`flex justify-center h-full ${!minimal && "overflow-auto"} ${isGenerated && "border-1 border-slate-200 p-3 rounded-md"}`}
    >
      <div className="text-xs pr-2 mt-10">
        {periods.map((period) => (
          <div className="h-18 opacity-70" key={period}>
            <p>{period}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="flex">
          {days.map((day) => (
            <div className="min-w-34 text-center p-2" key={day}>
              <p>{day}</p>
            </div>
          ))}
        </div>
        {periods.map((_, p) => (
          <div className="flex w-full" key={p}>
            {days.map((day, d) => {
              // const randomIndex = Math.floor(Math.random() * colors.length);
              // const color = colors[randomIndex];
              const cl = classes[`${daysMap[day]}${p + 1}`];

              return (
                <div
                  className="border-1 border-dashed border-slate-200 min-w-34 h-18"
                  key={d}
                >
                  {cl ? (
                    <div
                      className={`group relative w-full p-1 ${cl.color.color} hover:${cl.color.hover} cursor-pointer z-50 text-sm`}
                      style={{
                        height: `${72 * (cl.periodEnd - cl.periodStart)}px`,
                      }}
                    >
                      <p className="font-bold truncate">{cl.code}</p>
                      <p>📍 {cl.location}</p>
                      <p className="text-xs">
                        {cl.meetTimeBegin} -{cl.meetTimeEnd}
                      </p>

                      {!isGenerated && !minimal && (
                        <div className="absolute right-0 -top-0 group-hover:visible group-hover:bg-gray-100 rounded-md invisible">
                          <button
                            className="cursor-pointer px-2"
                            style={{ fontSize: "7px" }}
                            onClick={() => onRemoveClass(cl.classId)}
                          >
                            ❌
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScheduleDetails;
