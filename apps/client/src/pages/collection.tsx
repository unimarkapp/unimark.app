import { BookmarksGrid } from "@/widgets/bookmark/bookmarks-grid";
import { useParams } from "react-router-dom";

export default function Collection() {
  const params = useParams();

  return (
    <div className="">
      <BookmarksGrid collectionId={params.collection_id} />
    </div>
  );
}
