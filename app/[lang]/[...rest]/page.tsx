import { notFound } from "next/navigation";

/** Any address that is not a page shows the 404 page in the visitor's language. */
export default function CatchAll() {
  notFound();
}
