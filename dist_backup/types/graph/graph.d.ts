import { DeepSignal } from 'deepsignal';
import { type Elements, type IEdge, type INode } from '../types';
export interface Props {
    elements: DeepSignal<Elements>;
    addNode(node: DeepSignal<INode>): void;
    addEdge(edge: IEdge): void;
    width: number;
    height: number;
}
export declare const Graph: ({ elements, addNode, addEdge, width, height }: Props) => import("preact").JSX.Element;
