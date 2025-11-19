import AddStoryForm from "@/components/AddStoryForm/AddStoryForm";
import styles from "./page.module.css";

export default function CreateStoryPage() {
  return (
    <main>
      <AddStoryForm isEdit={false} />
    </main>
  );
}
