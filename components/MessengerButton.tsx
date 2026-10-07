import { MESSENGER } from "@/lib/site";
import Icon from "./Icon";

// The live site's blue bubble, bottom right, as a plain link (PO decision, spec 003).
export default function MessengerButton() {
  return (
    <a className="messenger" href={MESSENGER} target="_blank" rel="noopener noreferrer" aria-label="Scrie-ne pe Messenger">
      <Icon name="messenger" />
    </a>
  );
}
