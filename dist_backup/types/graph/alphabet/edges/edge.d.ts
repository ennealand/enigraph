import { EdgeType } from '$lib/types';
interface Props {
    type: EdgeType;
    noselect?: boolean;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    mousedown?: (e: MouseEvent) => void;
    mouseup?: (e: MouseEvent) => void;
}
export declare const Edge: ({ type, noselect, x1, y1, x2, y2, mousedown, mouseup }: Props) => import("preact").JSX.Element;
export {};
