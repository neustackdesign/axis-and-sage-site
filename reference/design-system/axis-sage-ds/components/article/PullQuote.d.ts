import * as React from "react";
/** Guide/article parts: PullQuote, Callout, AuthorCard, DataTable and the midnight ArticleEnd band. */
export interface PullQuoteProps {
  children?: React.ReactNode;
}
export declare function PullQuote(props: PullQuoteProps): JSX.Element;
export interface CalloutProps { label?: string; children?: React.ReactNode; }
export declare function Callout(props: CalloutProps): JSX.Element;
export interface AuthorCardProps { name: string; role: string; initials?: string; src?: string; }
export declare function AuthorCard(props: AuthorCardProps): JSX.Element;
export interface DataTableProps { columns: string[]; rows: React.ReactNode[][]; }
export declare function DataTable(props: DataTableProps): JSX.Element;
export interface ArticleEndProps { line?: string; cta?: string; href?: string; }
export declare function ArticleEnd(props: ArticleEndProps): JSX.Element;
