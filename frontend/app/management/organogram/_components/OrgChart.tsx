"use client";
import { constructPositionTree, getCurrentMySQLDate } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import panzoom, { PanZoom } from "panzoom";
import Button from "@/components/ui/Button";
import { useOrganogramDataStore } from "@/app/management/organogram/_store/useStore";
import { useToast } from "@/components/ui/use-toast";

const RootTreeNode = dynamic(() => import("./RootTreeNode"), {
    ssr: false,
});

export default function OrgChart() {
    const { employees, setEmployees, positions, setPositions } =
        useOrganogramDataStore();
    const [tree, setTree] = useState<Employee[] | null>(null);
    const elementRef = useRef(null);
    const panzoomRef = useRef<PanZoom>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { toast } = useToast();

    // Set up panzoom on mount, and dispose on unmount
    useLayoutEffect(() => {
        // @ts-ignore
        panzoomRef.current = panzoom(elementRef.current, {
            minZoom: 0.8,
            maxZoom: 1.5,
            pinchSpeed: 0.2,
            zoomDoubleClickSpeed: 1,
        });

        panzoomRef.current.on("pan", () => console.log("Pan!"));
        panzoomRef.current.on("zoom", () => console.log("Zoom!"));

        return () => {
            panzoomRef?.current?.dispose();
        };
    }, []);

    async function fetchEmployees() {
        axios
            .get<Employee[]>(
                process.env.NEXT_PUBLIC_API_URL + "/api/employees/"
            )
            .then((response) => {
                if (response.data.length > 0) {
                    console.log(response.data);
                    setEmployees(response.data);
                } else {
                    setPositions([]);
                }
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (employees) {
            const tree = constructPositionTree(employees);
            setTree(tree);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employees]);

    return (
        <div className="relative flex h-[500px] w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            <div className="absolute left-4 top-4 z-10 flex flex-col items-start justify-start">
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-purple-100 p-1 px-2 text-[8px] font-semibold text-purple-700">
                    Organization
                    <Icon
                        icon="fluent:organization-12-filled"
                        className="ml-1"
                        fontSize={10}
                    />
                </div>
                <div className="mt-2 flex w-full items-center justify-between">
                    <p className="text-2xl font-bold text-zinc-700">
                        Organizational Chart
                    </p>
                </div>
            </div>
            <div ref={elementRef}>
                {tree && (
                    <div className="flex gap-2">
                        {tree.map((root, index) => (
                            <RootTreeNode tree={root} depth={0} key={index} />
                        ))}
                    </div>
                )}
            </div>
            {/* Organogram Controls */}
            <div className="absolute right-4 top-4 flex items-center justify-center gap-2">
                <Button
                    className=""
                    onClick={() => {
                        panzoomRef.current?.zoomTo(0, 0, 1);
                        panzoomRef.current?.smoothMoveTo(0, 0);
                    }}
                    variant="alternateOutline"
                >
                    Center organogram
                    <Icon icon="fe:target" className="ml-1" fontSize={16} />
                </Button>
            </div>
        </div>
    );
}
