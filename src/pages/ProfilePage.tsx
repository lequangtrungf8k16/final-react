import { useState } from "react";
import CreatePostModal from "@/components/create-post/CreatePostModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  Bookmark,
  Camera,
  Circle,
  Contact,
  Grid3X3,
  PlusCircle,
  Settings,
} from "lucide-react";

export default function ProfilePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-10">
        <div className="flex justify-center items-center gap-4">
          <Circle size={100} color="lightgray" />
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <p>user name</p>
              <Settings />
            </div>
            <p>fullname</p>
            <div className="flex items-center gap-3">
              <span>0 posts</span>
              <span>0 followers</span>
              <span>0 following</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Edit profile</Button>
          <Button variant="secondary">View archive</Button>
        </div>
        <div className="flex flex-col items-center gap2 text-2xl">
          <PlusCircle color="lightgray" size={100} />
          new
        </div>
        <Tabs className="w-full flex flex-col items-center">
          <TabsList className="flex justify-evenly gap-10 px-10">
            <TabsTrigger value="posts" className="border-none">
              <Grid3X3 />
            </TabsTrigger>
            <TabsTrigger value="bookmark">
              <Bookmark />
            </TabsTrigger>
            <TabsTrigger value="tagged">
              <Contact />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="w-full p-4">
            <Card className="border-none shadow-none flex items-center">
              <div className="border-4 rounded-full p-3">
                <Camera size={40} />
              </div>
              <p className="text-2xl font-bold">Share Photos</p>
              <p>When you share photos, they will appear on your profile.</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="ghost"
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Share your first photo
              </Button>
            </Card>
          </TabsContent>
          <TabsContent value="bookmark" className="w-full px-4">
            <Card className="border-none shadow-none flex items-center">
              <div className="border-4 rounded-full p-3">
                <Bookmark size={40} />
              </div>
              <p className="text-2xl font-bold">Save</p>
              <p>
                Save photos and videos that you want to see again. No one is
                notified, and only you can see what you've saved.
              </p>
            </Card>
          </TabsContent>
          <TabsContent value="tagged" className="w-full h-full px-4">
            <Card className="border-none shadow-none  flex items-center">
              <div className="border-4 rounded-full p-3">
                <Camera size={40} />
              </div>
              <p className="text-2xl font-bold">Photos of you</p>
              <p>When people tag you in photos, they'll appear here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <CreatePostModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
