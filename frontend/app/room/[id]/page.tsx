"use client";
import { use } from "react";

export default function RoomIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return(
    <div>
        this is {id} page
    </div>
  )
}
