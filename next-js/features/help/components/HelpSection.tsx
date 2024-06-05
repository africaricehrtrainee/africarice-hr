import { Button } from "@/components/ui/button-cn"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AtSign, HelpCircle } from "lucide-react"
import React from "react"

function VideoFrame({ children }: { children: React.ReactNode }) {
    return <div className=" w-[1280px] h-[720px] rounded-md bg-muted">

        {children}
    </div>
}

export function HelpSection() {
    const videos: { title: string, src: string, key: string }[] = [
        {
            title: "How to create an objective",
            src: "/videos/objective-creation.webm",
            key: "objective-creation"
        },
        {
            title: "How to submit my objectives",
            src: "/videos/objective-submission.webm",
            key: "objective-submission"
        },
        {
            title: "How to approve/reject an objective",
            src: "/videos/objective-validation.webm",
            key: "objective-validation"
        }
    ]
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Help
                    <HelpCircle size={14} className="ml-1" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-fit">
                <DialogHeader className="flex flex-row items-center justify-between mt-2">
                    <div className="space-y-1">
                        <DialogTitle>Help Section</DialogTitle>
                        <DialogDescription>
                            Need help? Contact support or check our documentation.
                        </DialogDescription>
                    </div>
                    <Button type="button" variant="outline" asChild>
                        <a href="mailto:africarice-hrtrainee1@cgiar.org">
                            Contact support
                            <AtSign size={12} className="ml-2" />
                        </a>
                    </Button>
                </DialogHeader>
                <Tabs defaultValue="account" className="flex items-start justify-between w-full gap-4">
                    <TabsList className="flex flex-col items-start h-fit w-fit">
                        {videos.map((video, index) => (
                            <TabsTrigger key={index} value={video.key}>{video.title}</TabsTrigger>
                        ))}
                    </TabsList>
                    {videos.map((video, index) => (
                        <TabsContent key={index} className="flex justify-end w-full mt-0" value={video.key}>
                            <VideoFrame>
                                <video height="720" width="1280" controls>
                                    <source src={video.src} type="video/webm" />
                                </video>
                            </VideoFrame>
                        </TabsContent>
                    ))}
                </Tabs>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}