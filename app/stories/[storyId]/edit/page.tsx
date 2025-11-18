import AddStoryForm from "@/components/AddStoryForm/AddStoryForm";
import { getStoryById } from "@/lib/api/clientApi";

export default async function EditStoryPage({ params }: any) {
  const { storyId } = await params;

  const story = await getStoryById(storyId);

  return (
    <AddStoryForm
      initialData={{
        _id: story._id,
        img: story.img,
        title: story.title,
        article: story.article,
        category: story.category,
      }}
      isEdit={true}
    />
  );
}
