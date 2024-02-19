"use client";
import { cn } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useOrganogramDataStore } from "@/app/management/organogram/_store/useStore";
import axios from "axios";

function Label({ position }: { position: Employee }) {
    return (
        <button
            className={cn(
                "relative select-none cursor-pointer w-[200px] border border-transparent inline-block items-center justify-center gap-1 rounded-md p-3 px-5 text-xs transition-all font-semibold bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 hover:bg-purple-200 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            )}
        >
            <p>
                {position.firstName.split(" ")[0] +
                    " " +
                    (position.firstName.split(" ")[1]
                        ? position.firstName.split(" ")[1] + " "
                        : "") +
                    position.lastName}
            </p>
            <p className="text-[10px] font-medium">{position.jobTitle}</p>
        </button>
    );
}

export default function RootTreeNode({
    tree,
    depth,
}: {
    tree: Employee;
    depth: number;
}) {
    // if (tree.position.deletedAt !== null) return null;
    if (depth == 0 && tree.subordinates)
        return (
            <Tree lineColor="lightgray" label={<Label position={tree} />}>
                {tree.subordinates.map((child, index) => (
                    <RootTreeNode tree={child} depth={1} key={index} />
                ))}
            </Tree>
        );
    if (!tree.subordinates)
        return <TreeNode label={<Label position={tree} />} />;
    else
        return (
            <TreeNode label={<Label position={tree} />}>
                {tree.subordinates.map((child, index) => (
                    <RootTreeNode tree={child} depth={1} key={index} />
                ))}
            </TreeNode>
        );
}
