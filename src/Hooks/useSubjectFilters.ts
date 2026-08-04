import { useMemo, useState } from "react";
import type { Subject } from "../Types/academic";
import { matchesSubject } from "../Utils/academic";

export const useSubjectFilters = (subjects: Subject[]) => {
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("todos");
  const modules = useMemo(
    () => Array.from(new Set(subjects.map((subject) => subject.modulo))),
    [subjects],
  );
  const filteredSubjects = useMemo(
    () =>
      subjects.filter(
        (subject) =>
          (module === "todos" || subject.modulo === module) &&
          matchesSubject(subject, search),
      ),
    [subjects, search, module],
  );

  return { search, setSearch, module, setModule, modules, filteredSubjects };
};
