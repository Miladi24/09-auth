"use client";

import css from "@/app/page.module.css";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import type { Note } from "@/types/note";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isFetching } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", currentPage, debouncedSearch, tag],
    queryFn: () => fetchNotes(currentPage, debouncedSearch, tag),
    placeholderData: keepPreviousData,
    initialData: {
      notes: [],
      totalPages: 0,
    },
  });

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Show toast only when search is active and no notes found
  useEffect(() => {
    if (!isFetching && debouncedSearch && data.notes.length === 0) {
      toast.error("No notes found.");
    }
  }, [data.notes.length, debouncedSearch, isFetching]);

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={setSearch} />

        {data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <Link href="/notes/action/create" className={css.createNoteLink}>
          Create note +
        </Link>
      </div>

      {data.notes.length > 0 && <NoteList notes={data.notes} />}

      <Toaster />
    </div>
  );
}
