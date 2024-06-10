import { PropsWithChildren } from "react";
import { TooltipContent, TooltipProvider, Tooltip as ShadCNTooltip, TooltipTrigger } from "../ui/tooltip";

interface Props {
    text: string;
}

export const Tooltip = ({ children, text }: PropsWithChildren<Props>) => {
    return (
        <TooltipProvider delayDuration={100}>
            <ShadCNTooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{text}</p>
                </TooltipContent>
            </ShadCNTooltip>
        </TooltipProvider>
    );
}