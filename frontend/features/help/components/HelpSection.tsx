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
    return <div className=" w-[640px] h-[480px] rounded-md bg-muted">


    </div>
}

export function HelpSection() {
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
                        <TabsTrigger value="objective-creation">How to create an objective</TabsTrigger>
                        <TabsTrigger value="objective-submission">How to submit my objectives</TabsTrigger>
                    </TabsList>
                    <TabsContent className="flex justify-end w-full mt-0" value="objective-creation">
                        <VideoFrame>
                            <video height="480" width="640" src="./videos/objective-creation.webm" controls>
                            </video>
                        </VideoFrame>
                    </TabsContent>
                    <TabsContent className="flex justify-end w-full mt-0" value="objective-submission">
                        <VideoFrame>
                            <video height="480" width="640" src="./videos/objective-submission.webm" controls>
                            </video>
                        </VideoFrame>
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}