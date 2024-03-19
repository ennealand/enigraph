import { NodeType } from '$lib/types';
interface Props {
    type: NodeType;
    x: number;
    y: number;
    label?: string;
    noring?: boolean;
    mousedown?: (e: MouseEvent) => void;
    mouseup?: (e: MouseEvent) => void;
    textDoubleClick?: () => void;
    highlight?: boolean;
}
export declare const Node: ({ type, x, y, label, noring, mousedown, mouseup, textDoubleClick, highlight }: Props) => import("preact").JSX.Element;
export {};
